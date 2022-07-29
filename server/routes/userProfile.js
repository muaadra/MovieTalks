// Created by Muaad Alrawhani and Alex Jagot for Assignment 3

import express from 'express'
import path from "path";
import * as controller from '../controllers/profileControllers/userProfileController.js';

const router = express.Router()
const dirname = path.resolve();


//All the routes, calling their associated functionality from userProfileController.js
router.put("/updateUserProfile/", controller.updateUserProfile)
    
router.get("/assets/userImages/", controller.getUserImages)

router.get("/postView/:movieId/:threadId/:commentId?/:replyId?", controller.getPostData)

router.get("/userProfile/", controller.getUserProfile)


export { router as userProfile }
