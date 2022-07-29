import express from 'express'
const router = express.Router()
import movies from '../models/movie.js';


/**
 * Refrence:Search Text, Mongodb Docs
 * https://www.mongodb.com/docs/drivers/node/current/fundamentals/crud/read-operations/text/
 */
router.get("/search/:pageNumber/:limit/:query?", async (req, res) => {
    console.log("doc")

    let doc = await movies.find({ $text: { $search: req.params.query } },
        {//values to no return/project
            threads: 0, directors: 0, writers: 0, actors: 0,
            score: { $meta: "textScore" },
            // skip: 2,
        })

    if (!doc) {
        res.status(500).json({ success: false, message: "internal error" })
    } else {
        res.status(200).json({ success: true, body: doc })
    }
})

router.post("/movieFilters/:pageNumber/:limit/", async (req, res) => {
    console.log("/movieFilters/:pageNumber/:limit/")

    //create filters
    const filter = { $or: [] }

    for (const key of Object.keys(req.body)) {
        if (key !== "ratingFrom" && key !== "ratingTo"
            && key !== "yearFrom" && key !== "yearTo") {
            let k = "genreObj." + key
            filter["$or"].push({ [k]: true })
        }
    }

    if (req.body["ratingFrom"] || req.body["ratingTo"]) {
        filter["rating"] = {}
        if (req.body["ratingFrom"] && req.body["ratingFrom"] != 0) {
            filter["rating"]["$gte"] = req.body["ratingFrom"]
        }
        if (req.body["ratingTo"] && req.body["ratingTo"] != 0) {
            filter["rating"]["$lte"] = req.body["ratingTo"]
        }
    }

    if (req.body["yearFrom"] || req.body["yearTo"]) {
        filter["releaseDate"] = {}
        if (req.body["yearFrom"] && req.body["yearFrom"] != 0) {
            filter["releaseDate"]["$gte"] = req.body["yearFrom"]
        }
        if (req.body["yearTo"] && req.body["yearTo"] != 0) {
            filter["releaseDate"]["$lte"] = req.body["yearTo"]
        }
    }

    let doc = await movies.find(filter)

    if (!doc) {
        res.status(500).json({ success: false, message: "internal error" })
    } else {
        res.status(200).json({ success: true, body: doc })
    }

})

export { router as search }
