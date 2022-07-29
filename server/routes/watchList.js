import express from 'express'
import * as watchListController from '../controllers/watchListController.js'; //File which contains the logic for the backend functions

/**
The router used for routing all requests related to the Watch List feature
@author Muaad Alrawhani, B00538563 (original prototype version) and Corey Horsburgh, B00776091 (modified for final version)
*/

const router = express.Router()


router.post("/addToWatchList/", watchListController.addToWatchList); //POST call for adding to the list

router.get("/getWatchList/", watchListController.viewWatchList); //GET call for displaying the list

router.delete("/deleteFromWatchList/:movieId", watchListController.removeFromWatchList); //DELETE call for deleting an entry from the list

export { router as watchList }