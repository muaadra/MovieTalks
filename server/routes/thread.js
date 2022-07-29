import express from 'express'
const router = express.Router()
import admin from '../models/admin.js';
import usersCollection from '../models/user.js';
import { ObjectId } from 'mongodb';
import path from 'path';
const dirname = path.resolve();
import allMovieThreads from '../models/thread.js';

router.post("/flagAPost/", async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }

    admin.updateOne({}, {
        '$push': { "flaggedPosts": req.body },
    }, { upsert: true }, (err, doc) => {
        if (!err) {
            res.status(200).json({ success: true })
        } else {
            console.log(err)
            res.status(500).json({ success: false, message: "internal error" })
        }
    })
})


router.get("/getUserImageForThreads/:id", async (req, res) => {
    //find the user based off of the id
    if (req.params.id == "undefined") {
        return res.send(null)
    }
    const user = await usersCollection.findOne({ _id: ObjectId(req.params.id) })
    //if there is no profile image name, return null
    if (!user.profileImageName) {
        return res.send(null)
    }
    const root = path.join(dirname, "assets", "userImages", user.profileImageName)
    //send the file
    res.sendFile(root, (err) => {
        if (err) {
            console.log(err)
        }
    });
})

router.post("/setVote/", async (req, res) => {
    console.log("/setVote/")
    if (!req.user) {
        return res.status(401).json({ success: false })
    }
    const vote = parseInt(req.body.vote)
    if (vote > 1 || vote < -1) {
        return res.status(400).json({ success: false })
    }

    try {

        let doc = await allMovieThreads.findOne({
            _id: req.body.movieId,
            "threads._id": req.body.threadId
        })

        for (let i = 0; i < doc.threads.length; i++) {
            if (doc.threads[i]._id == req.body.threadId) {
                const prevVote = doc.threads[i].voteCount

                if (prevVote == 1 && vote == 0) {
                    doc.threads[i].voteCount -= 1
                } else if (prevVote == 1 && vote == -1) {
                    doc.threads[i].voteCount -= 2
                } else if (prevVote == -1 && vote == 0) {
                    doc.threads[i].voteCount += 1
                } else if (prevVote == -1 && vote == 1) {
                    doc.threads[i].voteCount += 2
                } else if (prevVote == 0) {
                    doc.threads[i].voteCount += vote
                }

                doc.threads[i].voters[req.user._id] = vote

                console.log(doc.threads[i])

                doc.markModified("threads");
                doc.save()
                res.json({ success: true, message: "success", body: doc.threads[i] })
            }

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }


})



export { router as thread }