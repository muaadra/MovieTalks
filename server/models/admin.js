import { ObjectId } from "mongodb"
import mongoose from "mongoose"

const adminSchema = new mongoose.Schema({
    flaggedPosts: [
        {
            postType: String, //thread, comment, reply
            movieId: String,
            threadId: String,
            commentId: String,
            replyId: String,
        }
    ],
    movieSubmissions: [
        {
            title: String,
            releaseDate: Date,
            genere: String,
            description: String,
            ratingType: String,
            directors: String,
            writers: String,
            actors: String,
            trailerURL: String,
            posterURL: String,
            userId: ObjectId, //the id of the submitter
            userEmail: String
        }
    ]

})

export default mongoose.model("admin", adminSchema)
