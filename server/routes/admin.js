
import express from 'express'
const router = express.Router()
import admin from '../models/admin.js';
import { sendEmail } from "../tools/sendEmails.js"
import movie from "../models/movie.js";
import { ObjectId } from 'mongodb';
import mongoose from "mongoose"
import { getPostData } from "../controllers/profileControllers/userProfileController.js"
import { deleteAThread, deleteAcommentOrAReply } from "./moviesData.js"

/**
 * getting a list of movie submissions
 */
router.get("/movieSubmissions/", async (req, res) => {
    console.log("/movieSubmissions/")
    admin.findOne({}, { "movieSubmissions": 1 }, (err, doc) => {
        if (!err && doc) {
            res.status(200).json({ success: true, body: doc.movieSubmissions })
        } else if (err) {
            console.log(err)
            res.status(500).json({ success: false, message: "internal error" })
        }
    })
})

/**
 * getting a list of flagget posts
 */
router.get("/flaggedPosts/", async (req, res) => {
    console.log("/flaggedPosts/")

    //please note that this part is set to true instead of user.isAdmin
    //for the purpose of testing purposes only, so any signed in user (e.g the TA) can test/examin 
    //the feature from any account
    if (true) {
        //get the list of flagged posts, then get post snapshots from the 
        //"threads" database
        admin.find({}, { "flaggedPosts": 1 }, (err, doc) => {
            if (!err && doc) {
                res.status(200).json({ success: true, body: (doc[0] ? doc[0].flaggedPosts : []) })
            } else {
                console.log(err)
                res.status(500).json({ success: false, message: "internal error", body: [] })
            }
        }).lean()
        // getAPostView

    } else {
        res.status(401).json({ success: true, message: "401 Unauthorized", body: [] })
    }
})

router.post("/approval/", async (req, res) => {
    console.log("/approval/")

    //please note that this part is set to true instead of user.isAdmin
    //for the purpose of testing purposes only, so any signed in user (e.g the TA) can test/examin 
    //the feature from any account
    if (true) {
        // //send email
        sendEmail(req.body.email, req.body.subject, req.body.emailBody)
        console.log(req.body.approved)

        //add movie to movies db
        if (req.body.approved) {
            //get movie from admin db and add it to movies db
            admin.findOne({ "movieSubmissions._id": ObjectId(req.body.adminMovieId) },
                { "movieSubmissions.$": 1 }, (err, doc) => {
                    if (!err) {
                        if (doc.movieSubmissions.length > 0) {
                            let movieDoc = prepMovieDoc(doc.movieSubmissions[0])

                            //add to movies db
                            movie.create(movieDoc)

                            //delete movie from admin
                            deleteSubmissionFromAdmin(req)
                            return res.status(200).json({ success: true })

                        }
                    } else {
                        console.log(err)
                        return res.status(500).json({ success: false, message: "internal error" })
                    }
                })
        } else {
            //delete movie from admin
            deleteSubmissionFromAdmin(req)
        }

        res.status(202).json({ success: true, message: "email will be sent, request being process." })
    } else {
        res.status(401).json({ success: false, message: "401 Unauthorized" })
    }
})

router.post("/dismissFlaggedPost/", async (req, res) => {
    console.log("/dismissFlaggedPost/")
    console.log(req.body.flaggedId)
    // return res.status(200).json({ success: true })
    admin.updateOne({}, {
        '$pull': { "flaggedPosts": { _id: ObjectId(req.body.flaggedId) } },
    }, (err, doc) => {
        console.log(err)
        return res.status(200).json({ success: true })
    })

})

router.delete("/adminDeleteAPost/:authorId/:movieId/:threadId/:commentId?/:replyId?", async (req, res) => {

    const authorId = req.params.authorId
    const movieId = req.params.movieId
    const threadId = req.params.threadId
    const commentId = req.params.commentId
    const replyId = req.params.replyId

    if (!authorId) {
        return res.status(401).json({ success: false, message: "Unauthorised" })
    }

    console.log("/adminDeleteAPost/", authorId, movieId, threadId, commentId, replyId)

    //Delete the post
    if (replyId && commentId) {
        deleteAcommentOrAReply(authorId, movieId, threadId, commentId, replyId, res)
    } else if (commentId) {
        deleteAcommentOrAReply(authorId, movieId, threadId, commentId, null, res)
    } else {
        deleteAThread(authorId, movieId, threadId, res)
    }

    //remove from admin side 
    let flagged = await admin.findOne({})
    if (flagged.flaggedPosts) {
        for (let i = 0; i < flagged.flaggedPosts.length; i++) {
            //Delete the post
            if (replyId && flagged.flaggedPosts.replyId == replyId) { //reply
                flagged.flaggedPosts.splice(i, 1); //Splice the movie out of the array
                break
            } else if (commentId && flagged.flaggedPosts.commentId == commentId) {
                flagged.flaggedPosts.splice(i, 1); //Splice the movie out of the array
                break
            } else if (flagged.flaggedPosts.threadId == threadId) {
                flagged.flaggedPosts.splice(i, 1); //Splice the movie out of the array
                break
            }

        }
        flagged.save()
    }



})


function deleteSubmissionFromAdmin(req) {
    admin.updateOne({}, {
        '$pull': { "movieSubmissions": { _id: ObjectId(req.body.adminMovieId) } },
    }, (err, doc) => {
        console.log(err)
    })
}

function prepMovieDoc(movieDoc) {
    movieDoc = JSON.parse(JSON.stringify(movieDoc))
    //convert genre from array to object
    let genreArr = movieDoc.genere.replace(" ", "").split(",")
    let genreObj = {}
    for (let i = 0; i < genreArr.length; i++) {
        genreObj[genreArr[i]] = true
    }
    movieDoc.genreObj = genreObj
    movieDoc._id = new mongoose.Types.ObjectId().toString()
    return movieDoc
}

export { router as movieSubmissions }
