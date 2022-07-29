//File meant to hold all the routes and functionality for routes/userProfile.js
// Created by Muaad Alrawhani and Alex Jagot for Assignment 3

import path from 'path';
import { ObjectId } from "mongodb"
import multer from "multer"
import { getReply, getComment, getThread } from '../../tools/postRetrieval.js';
import usersCollection from '../../models/user.js';
//import admin from '../models/admin.js';

const dirname = path.resolve();
/**
 * Refrence:
 * The follwoing tutorial was follwed on how to upload images/files
 * https://www.youtube.com/watch?v=EVOFt8Its6I&ab_channel=TheFullStackJunkie
 */

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../../Group1_MovieTalks/server/assets/userImages")
    },
    filename: function (req, file, cb) {
        if (req.user) {
            cb(null, req.user._id + path.extname(file.originalname))
        } else {
            cb(new Error("not signed in"))
        }
    }
})

/**
 * Refrence:
 * The follwing post was used to help define file extensions for images
 * https://stackoverflow.com/questions/38652848/filter-files-on-the-basis-of-extension-using-multer-in-express-js
 */
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        const extension = path.extname(file.originalname).toLowerCase();
        if (extension !== ".jpg" && extension !== ".png" && extension !== ".jpeg" && extension !== ".gif") {
            return callback(new Error("only images of type PNG, JPG, GIF, and JPEG are accepted"))
        }
        callback(null, true)
    }
}).single("userProfileImage")


//Const meant to handle updating the user profile
export const updateUserProfile = async (req, res) => {
    if (req.user) {
        //uses the multer library to upload data
        upload(req, res, async function (err) {
            if (err) {
                return res.status(400).json({ success: false, message: err.message })
            } else {
                try {
                    //get user data from db
                    const user = await usersCollection.findOne({ _id: ObjectId(req.user._id) })
                    //Changes the users about me section to the input one
                    user.aboutMe = req.body.aboutMe
                    if (req.file) {
                        user.profileImageName = req.file.filename
                    }
                    //saving the data
                    user.save()
                    return res.status(200).json({ success: true, body: user })
                } catch (e) {
                    res.status(500).json({ success: false, message: "internal server error" })
                }
            }
        })
    } else {
        res.json({ success: true, message: "user is not signed in" })
    }
}
//Const meant to get the users images
export const getUserImages = async (req, res) => {
    if (req.user) {
        //find the user based off of the id
        const user = await usersCollection.findOne({ _id: ObjectId(req.user._id) })
        //if there is no profile image name, return null
        if (!user.profileImageName) {
            return res.send(null)
        }
        const root = path.join(dirname, "assets", "userImages", user.profileImageName)
        //send the file
        res.sendFile(root, (err) => {
            if (err) {
                res.send(null)
            }
        });
    } else {
        return res.status(401).json({ success: false, message: "Unauthorised" })
    }
}
export const getPostData = async (req, res) => {
    //setting the variables to be equal to the input id's
    let movieId = req.params.movieId
    let threadId = req.params.threadId
    let commentId = req.params.commentId
    let replyId = req.params.replyId

    //Functionality that gets the associateed reply, comment, or thread
    if (replyId) {
        getReply(movieId, threadId, commentId, replyId, cb)
    } else if (commentId) {
        getComment(movieId, threadId, commentId, cb)
    } else {
        getThread(movieId, threadId, cb)
    }

    function cb(doc) {
        if (doc) {
            return res.json({ success: true, body: doc })
        } else {
            return res.json({ success: false, message: "not found", body: null })
        }
    }

}

//number of post required to achieve a rank
//Example, to reach silver you need more than or equal to 300 posts
const ranks = [
    ["expert", 3000],
    ["gold", 2000],
    ["silver", 1000],
    ["bronze", 300],
    ["newbie", 0],
]
export const getUserProfile = async (req, res) => {

    if (req.user) {
        try {
            //get user data from db
            const user = await usersCollection.findOne({ _id: ObjectId(req.user._id) })

            if (user) {
                //every field is needed except for password, so remove before sending the user object 
                delete user.password

                //get rank
                for (let i = 0; i < ranks.length; i++) {
                    if (user.posts && user.posts.length >= ranks[i][1]) {
                        user.Rank = ranks[i][0]
                        break;
                    }
                }

                return res.status(200).json({ success: true, body: user })
            }
        } catch (e) {
            res.status(500).json({ success: false, message: "internal server error" })
        }
    }

    return res.json({ success: true, message: "user is not signed in" })
}
