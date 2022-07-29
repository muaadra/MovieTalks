// Authored by Jack Hipson

import express from 'express'
import { ObjectId } from 'mongodb';
import admin from '../models/admin.js';

const router = express.Router()


router.get("/userMovieSubmissions/", async (req, res) => {
    try {
        const adminObj = await admin.findOne();
        const movieSubmissions = adminObj ? adminObj.movieSubmissions
            .filter((s) => s.userId?.toString() === req.user._id) : [];
        res.status(200).json({ success: true, body: movieSubmissions });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.delete("/deleteMovieSubmissions/:adminMovieId", async (req, res) => {
    try {
        const adminObj = await admin.findOne();
        const submissionExists = adminObj?.movieSubmissions
            .some((s) => s._id.toString() === req.params.adminMovieId);
        if (!submissionExists) {
            throw new Error(`Submission (${req.params.adminMovieId}) does not exist`);
        }

        adminObj.movieSubmissions = adminObj.movieSubmissions
            .filter((s) => s._id.toString() !== req.params.adminMovieId);
        await adminObj.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.put("/updateMovieSubmissions/", async (req, res) => {
    try {
        const adminObj = await admin.findOne();
        const movie = {
            _id: req.body._id,
            title: req.body.title,
            releaseDate: req.body.releaseDate,
            genere: req.body.genere,
            description: req.body.description,
            ratingType: req.body.ratingType,
            directors: req.body.directors,
            writers: req.body.writers,
            actors: req.body.actors,
            trailerURL: req.body.trailerURL,
            posterURL: req.body.posterURL,
            userId: req.user._id,
            userEmail: req.user.email
        }

        const index = adminObj ? adminObj.movieSubmissions
            .findIndex((s) => s._id.toString() === req.body._id) : -1;
        if (index === -1) {
            throw new Error(`Submission (${req.body._id}) does not exist`);
        }

        adminObj.movieSubmissions[index] = movie;
        await adminObj.save();
        res.status(200).json({ success: true })
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

router.post("/movieSubmissions/", async (req, res) => {
    try {
        let adminObj = await admin.findOne();
        if (!adminObj) {
            adminObj = new admin({
                flaggedPosts: [],
                movieSubmissions: [],
            })
        }
        const movie = {
            _id: ObjectId(),
            title: req.body.title,
            releaseDate: req.body.releaseDate,
            genere: req.body.genere,
            description: req.body.description,
            ratingType: req.body.ratingType,
            directors: req.body.directors,
            writers: req.body.writers,
            actors: req.body.actors,
            trailerURL: req.body.trailerURL,
            posterURL: req.body.posterURL,
            userId: req.user._id,
            userEmail: req.user.email
        }
        adminObj.movieSubmissions.push(movie);

        await adminObj.save();
        res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
})

export { router as movieSubmission }
