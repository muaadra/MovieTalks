/**
 * The router is for routing all requests pretainig to authentication of
 * users.
 * it routes for the following:
 * signing in (login), sign in up, resetting a password, signing out deleteing an account 
 * 
 * @author Muaad Alrawhani, B00538563
 */

import express from 'express'
const router = express.Router()
import * as authController from "../controllers/authControllers/authController.js"

router.post('/login/', authController.signIn_post)

router.post('/reset/', authController.reset_post)

router.post('/resetByEmail/', authController.resetByEmail_post)

router.get('/isAuth/', authController.isAuth_get)

router.post('/logout', authController.logout_post)

router.post('/signup', authController.signUp_post, authController.signIn_post)

router.delete('/deleteAccount/', authController.deleteAccount_delete)

export { router }
