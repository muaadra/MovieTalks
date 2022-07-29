/**
 * 
 * Refrence:
 * Express documentation
 * https://expressjs.com/en/guide/routing.html
 * 
 * add the route to Index.js
 */
import express from 'express'
import usersCollection from '../models/user.js';
import { ObjectId } from 'mongodb';
import movies from '../models/movie.js';

const router = express.Router()

router.get("/userRating/:movieId", async (req, res) => {
    if (req.user) {
        try {
            //get user data from db and check if the user has rated the movie with req.params.movieId
            const user = await usersCollection.findOne({ _id: ObjectId(req.user._id) })

            if (user && user.ratings[req.params.movieId]) {
                return res.status(200).json({ success: true, body: { rating: user.ratings[req.params.movieId] } })
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({ success: false, message: "internal server error" })
        }
    }

    return res.json({ success: true, message: "user is not signed in", body: { rating: -1 } })

})

router.post("/userRating/", async (req, res) => {
    try {
        // validate rate value
        if (!(req.body.rateValue > 0 && req.body.rateValue <= 10)) {
            return res.status(400).json({ success: false, message: "bad rating value" })
        }

        //get user data from db and add movie rating,  doesn't need to validate movie id, since it will be ignored
        // if doesn't match a movie id
        const user = await usersCollection.findOne({ _id: ObjectId(req.user._id) }) //threads id is the same as movie ids
        if (user) {
            //to only allow for one user rating, we need to check if the user already 
            //rated this movie 
            const oldRating = user.ratings[req.body.movieId] // if it exists

            //add the rating to the user db
            user.ratings[req.body.movieId] = req.body.rateValue
            user.markModified("ratings"); // you need this if you are adding to an object. provide path to the  modified object field
            user.save()

            //add rating to the movie db
            const updatedMovie = await updateMovieRatings(req.body.movieId, req.body.rateValue, oldRating)
            console.log(updatedMovie)
            return res.status(200).json({ success: true, message: "rating was added", body: updatedMovie })
        }
        return res.status(404).json({ success: false, message: "user not found" })
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: "internal server error" })
    }
})


async function updateMovieRatings(movieId, userRating, oldRating) {
    const movie = await movies.findOne({ _id: movieId })

    if (!oldRating) { //this is the first time the user is rating
        movie.rating = movie.rating + (userRating - movie.rating) / (movie.ratingCount + 1)
        movie.ratingCount++
    } else {
        //subtract the old one
        movie.rating = ((movie.rating * movie.ratingCount) - oldRating) / (movie.ratingCount - 1)

        //add the new one
        movie.rating = movie.rating + (userRating - movie.rating) / (movie.ratingCount)
    }


    movie.ratingScore = getScore(movie)
    movie.save()
    return movie
}

//Refrence:
//https://stackoverflow.com/questions/2495509/how-to-balance-number-of-ratings-versus-the-ratings-themselves
//based on answer by k_ssb
function getScore(movie) {
    const R = 5
    const W = 6
    const ratingCount = parseInt(movie.ratingCount)
    const rating = parseInt(movie.rating)
    console.log(movie)

    let score = (R * W + ratingCount * rating) / (W + ratingCount)
    return score
}




export { router as userRating }
