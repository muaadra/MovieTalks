/**
 * This script is the controller for the router auth.js found in routes/auth.js
 * Here are functions that handle the follwing user authentication requests:
 * signing in, sign in up, resetting a password, signing out deleteing an account
 * 
 * @author Muaad Alrawhani, B00538563
 */

import { isPasswordValid, isEmailValid, validateSignUp } from "./validation.js"
import passport from "passport"
import bcrypt from "bcrypt"
import crypto from 'crypto';
import sendResetEmail from "../../tools/sendEmails.js"
import { ObjectId } from 'mongodb';
import { db } from "../../index.js"
import usersCollection from '../../models/user.js';

/**
 * handles signing up of users
 */
export const signUp_post = async (req, res, next) => {
    //get user info
    const email = req.body.email.toLowerCase()
    const username = req.body.username
    const password = req.body.password

    //check if all values are valid
    let valid = validateSignUp(email, username, password);

    if (!valid.success) {
        res.status(400).json({ success: false, message: valid.message })
        return
    }

    //try adding user data to "users" collection
    try {
        const userEmail_DB = await usersCollection.findOne({ "email": email })
        if (userEmail_DB) { //already exists with the same email
            res.status(409).json({ success: false, message: "email already exists, please login instead or reset your password" })
            return
        } else {
            //check if username exists
            const username_DB = await usersCollection.findOne({ "username": username })
            if (username_DB || username == "Deleted User") {
                res.status(409).json({ success: false, message: "Username is already taken, please try another username" })
                return
            }

            //hash the password
            const hashedPassword = await bcrypt.hash(password, 10)

            //add user to db
            let newUser = new usersCollection({
                username,
                password: hashedPassword,
                email: email,
                posts: [],
                ratings: {},
                dateJoined: Date.now(),
                Rank: "Newbie",
                RankPoints: 0,
                aboutMe: "...",
                profileImageName: null,
                isAdmin: (username.toLowerCase().includes("admin") ? true : false)
            })

            newUser.save((err, doc) => {
                //create a user profile in 'userprofiles'
                if (doc && doc._id) {
                    db.collection('userprofiles').insertOne({
                        userId: doc._id,
                        watchlist: [],
                    })
                }
                next() //next is signing in
            })

        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}


/**
 * handles signing in of users
 */
export const signIn_post = async (req, res, next) => {
    //get email, and lower case it
    req.body.email = req.body.email.toLowerCase()
    let userEmail = req.body.email

    //check if email is valid
    let emailValidation = isEmailValid(userEmail)
    if (!emailValidation.success) {
        res.status(400).json(emailValidation)
        return
    }

    try {
        //check if user exists in db
        const userEmail_DB = await usersCollection.findOne({ "email": userEmail })
        if (!userEmail_DB) {
            res.status(404).json({ success: false, message: "Email doesn’t exist in our database. Try signing up instead" })
            return
        }

        //authenticate user using Passport
        passport.authenticate('local', function (err, user, info) {
            if (!user) {
                //incorrect password
                res.status(401).json({ success: false, message: "Incorrect password. Try again or click on ‘Reset Password" })
            } else {
                //sends the session token to the user
                req.login(user, function (error) {
                    if (error) return next(error);
                    return res.json({
                        success: true,
                        message: "logged in",
                        user: {
                            _id: user._id,
                            username: user.username,
                            email: user.email
                        }
                    });
                });
            }
        })(req, res, next);
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }

}


/**
 * handles resetting a password
 * check if the user email actually exists in the db, if yes
 * - create a reset code, and store it in "resetRequests" collection
 * - email the reset code to the user 
 */
let resetDBCount = 0 //count of how many inserts to "resetRequests" db since server start (for removing expired tokens)
export const reset_post = async (req, res) => {
    //validate email
    let userEmail = req.body.email.toLowerCase()
    let emailValidation = isEmailValid(userEmail)
    if (!emailValidation.success) {
        return res.json(emailValidation)
    }

    try {
        //find email in users db 
        const user = await usersCollection.findOne({ "email": userEmail })

        //if a user exists with this email, send reset code
        if (user) {
            //create reset code
            let code = crypto.randomBytes(24).toString('hex')

            //add it to resetRequests collection so to track it and to set expiration date
            await db.collection('resetRequests').insertOne({
                "_id": code,
                email: userEmail,
                expiryDate: Date.now() + (1000 * 60 * 60 * 24) //expires in 1 day
            })

            //perform deleting of expired reset tokens when (server starts and first insert) or (when count > x)
            if (resetDBCount == 0 || resetDBCount >= 1000) {
                let time = Date.now()
                db.collection('resetRequests').deleteMany({ expiryDate: { $lt: time } })
                resetDBCount = 0
            }
            resetDBCount++

            //send email
            sendResetEmail(userEmail, code)

            res.json({
                success: true,
                message: "password reset instructions will be sent to the provided email " +
                    "address, this may take a few minutes (sometime 5 min) as we rely on Yahoo service. Please check you spam/junk folder as well"
            })

        } else {
            res.json({ success: false, message: "Email doesn’t exist in our database, try signing up instead" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }
}

/**
 * This handles the second stage of resetting the password
 * - The user clicks on the URL that contains the reset code
 * - the function checks if the code is in db and if it is still valid
 * - if valid, then hash the new pawword and replace the old one 
 */
export const resetByEmail_post = async (req, res) => {

    //check if password is valid
    const userPass = isPasswordValid(req.body.password)
    if (!userPass.success) {
        return res.json(userPass)
    }

    try {
        //check if the code exists in db
        const user = await db.collection('resetRequests').findOneAndDelete({ "_id": req.body.code })
        if (!user.value) {
            res.json({ success: false, message: "code is expired, try resetting your password again" })
        } else {
            //hash the new password and replace the old one
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            await usersCollection.updateOne({ "email": user.value.email }, {
                $set: { password: hashedPassword }
            })

            res.json({ success: true, message: "Password successfully reset!" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }

}

/**
 * checks if the user is signed in
 */
export const isAuth_get = (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ success: true, user: req.user })
    } else {
        //should not send an error because this is a casual check if a user is signed in
        res.json({ success: false, message: "not logged in" })
    }
}

/**
 * logs out the user
 */
export const logout_post = (req, res) => {
    req.logout(function (err) {
        if (err) {
            return res.status(500).json({ message: "logged out" })
        }
        res.status(200).json({ message: "logged out" })
    });
}


/**
 * logs out the user and deletes the account from db
 */
export const deleteAccount_delete = async (req, res) => {
    const id = req.user._id
    try {
        //logout the user
        req.logout(async function (err) {
            if (err) {
                res.status(500).json({ message: "logged out" })
                return;
            }

            //delete the user
            usersCollection.deleteOne({ "_id": ObjectId(id) }, async (err, doc) => {
                console.log(doc)
                if (!err) {
                    res.json({ success: true, message: "Account Deleted" })
                }
            })

        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message })
    }

}