import mongoose from "mongoose"

const movieSchema = new mongoose.Schema({
    _id: String,
    title: String,
    TMDBmovieId: {}, //any type (string or anumber)
    rating: Number,
    ratingScore: Number,
    releaseDate: Date,
    ratingCount: Number, //any type (string or anumber)
    genere: String,
    genreObj: {},//eg. Drama : true
    description: String,
    ratingType: String,
    directors: String,
    writers: String,
    actors: String,
    trailerURL: String,
    posterURL: String,
    threads: [],//ids to threads
})
movieSchema.index({ title: 'text' })

export default mongoose.model("movies", movieSchema)
