import userProfile from '../models/userProfile.js';
import { ObjectId } from 'mongodb';

/**
This is the scripts for the watch list features
It does the following:
Add to watch list, remove from watch list, view watch list
@author Muaad Alrawhani, B00538563 (original prototype version) and Corey Horsburgh, B00776091 (modified for final version)
*/

export const viewWatchList = async (req, res) => {

    try {
        const userID = req.user._id; //User whose list will be displayed
        const user = await userProfile.findOne({ 'userId': ObjectId(userID) }); //Find the user in "userProfiles" collection

        //revers array
        user.watchlist.reverse()

        return res.status(200).json({ success: true, body: user.watchlist }); //Return their watch list
    }
    catch (err) {
        return res.status(500).json({ success: false });
    }
}

export const addToWatchList = async (req, res) => {

    try {
        const userID = req.user._id;
        const user = await userProfile.findOne({ 'userId': ObjectId(userID) });
        const movieID = req.body.movieId;
        var isInList = false; //To check if a movie is already on the list
        for (let i = 0; i < user.watchlist.length; i++) { //Go through the watch list
            if (user.watchlist[i] === movieID) { //If it is on the list
                isInList = true;
            }
        }
        if (isInList === false) { //Not on the list
            user.watchlist.push(movieID); //Add to list
            await user.save(); //Save changes to watch list
            return res.status(200).json({ success: true }) //Return status to notify user that movie has been added
        }
        else { //Already on the list
            console.log("Movie is already in list");
            return res.status(200).json({ onList: true }) //Return status to notify user that movie is already on list
        }
    }
    catch (err) {
        return res.status(500).json({ success: false });
    }
}

export const removeFromWatchList = async (req, res) => {

    try {
        const userID = req.user._id;
        const movieID = req.body.movieId; //Movie to be removed from list
        const user = await userProfile.findOne({ 'userId': ObjectId(userID) }); //Find the user in "userProfiles" collection
        const index = user.watchlist.indexOf(movieID) //Find where the movie is in the array
        user.watchlist.splice(index, 1); //Splice the movie out of the array
        await user.save(); //Save changes to the user entry
        //revers array
        user.watchlist.reverse()
        res.status(200).json({ success: true, body: user.watchlist }) //Return the new array with the movie removed
    }
    catch (err) {
        return res.status(500).json({ success: false });
    }
}

//https://www.w3schools.com/js/js_array_methods.asp Used as a reference for splicing the array