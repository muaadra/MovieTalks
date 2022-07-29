/**
 * The router is for routing all requests for the featured movies slideshow such as
 * 
 * @author Matt Whitehead, B00783328
 */

import express from 'express'
const router = express.Router()
import * as featuredMoviesController from "../controllers/featuredMoviesController.js"

// Route for getFeaturedMovies that will be called by the frontend FeaturedMovies component
router.get('/getFeaturedMovies', featuredMoviesController.getFeaturedMovies_get)
 
export { router as featuredMovies }