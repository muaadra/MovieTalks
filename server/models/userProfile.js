import mongoose from "mongoose"
import { ObjectId } from "mongodb"

const userProfile = new mongoose.Schema({
    userId: ObjectId,
    watchlist: [],//movie ids
})

export default mongoose.model("userProfile", userProfile)
