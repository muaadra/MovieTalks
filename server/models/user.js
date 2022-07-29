/**
 * This file contains the mongoose user Schema 
 * @author Muaad Alrawhani, B00538563
 */

import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    dateJoined: Number,
    Rank: String, //the name of the rang (e.g., newbie)
    RankPoints: Number, //points achieved so far
    aboutMe: String,
    profileImageName: String, //the name of profile image stored in /assets/images (not url)
    isAdmin: Boolean,
    ratings: Object, //a set of objects {movieId:ratingValue}
    posts: [    //list of refrences to user posts (i.e., thread, comment, or reply)
        {
            postType: String, //thread, comment, reply
            movieId: String,
            threadId: String,
            commentId: String,
            replyId: String,
        }
    ],
}, { minimize: false })

export default mongoose.model("users", userSchema)
