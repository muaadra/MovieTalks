
import express from 'express'
const router = express.Router()
import movies from '../models/movie.js';


router.get("/topRated/", async (req, res) => {
    let doc = await movies.find().sort({ "ratingScore": -1 }).limit(10);
    if (doc) {
        // console.log(doc)
        res.status(200).json({ success: true, body: doc })
    } else {
        res.status(500).json({ success: false, message: "internal error" })
    }
})


export { router as topRatedMovies }