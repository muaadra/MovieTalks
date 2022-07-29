import { ObjectId } from "mongodb";
import mongoose from "mongoose"

const replySchema = new mongoose.Schema({
    _id: { type: String, index: true },
    repliedTo: String, //id of the reply or thread 
    userId: String,
    userName: String,
    postDate: Number,
    postType: String,
    postText: String,
    edited: Boolean
});

replySchema.add({
    replies: [replySchema]
})


const mainThreadSchema = new mongoose.Schema({
    _id: String,
    userId: String,
    userName: String,
    threadType: String,
    postDate: Number,
    voteCount: Number,
    voters: {}, //{userId:+/-1}
    postTitle: String,
    postText: String,
    userRating: Number,
    spoilers: Boolean,
    edited: Boolean,
    flaggedId: ObjectId,
    replies: [replySchema]
}, { minimize: false })

const allMovieThreads = new mongoose.Schema({
    _id: String, //the movie id these threads belong to
    threads: [mainThreadSchema]
})


export default mongoose.model("threads", allMovieThreads)
