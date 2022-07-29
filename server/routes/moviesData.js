/**
 * 
 * Refrence:
 * Express documentation
 * https://expressjs.com/en/guide/routing.html
 */
import express from 'express'
const router = express.Router()
import moviesCollection from '../models/movie.js';
import allMovieThreads from '../models/thread.js';
import mongoose from "mongoose"
import crypto from 'crypto';
import usersCollection from '../models/user.js';
import { ObjectId } from 'mongodb';


const defaultFeaturedMovieIds = [
    'tt10648342', 'tt5108870',
    'tt11252248', 'tt8041270',
    'tt11827628', 'tt8009428',
    'tt4123432', 'tt13320622',
    'tt1464335', 'tt11291274',
]
let nowPlayingIMDBIds = defaultFeaturedMovieIds;

router.get("/getMovie/:id", async (req, res) => {
    let movie = await moviesCollection.findOne({ _id: req.params.id })
    res.json(movie)
})

router.get("/getThreads/:movieId", async (req, res) => {
    console.log("Req: /getThreads/:movieId")

    const movieThreads = await allMovieThreads.findOne({ _id: req.params.movieId }) //threads id is the same as movie ids
    res.json({ success: true, message: "success", body: (movieThreads ? movieThreads.threads : []) })
})

/**
 * get a thread page
 */
router.get("/getAThread/:movieId/:threadId", async (req, res) => {
    console.log("Req: /getAThread/:movieId/:threadId", req.params.movieId, req.params.threadId)

    try {
        allMovieThreads.findOne({
            _id: req.params.movieId,
            "threads._id": req.params.threadId
        },
            { "threads.$": 1 }, function sendResp(err, doc) {
                if (err || !doc) {
                    res.status(404).json({ success: false, message: "no thread" })
                } else {
                    res.json({ success: true, message: "success", body: prepThreadResponse(doc.threads[0]) })
                }
            })
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: "internal error" })
    }
})


/**
 * get a thread page
 * ids of replies are passed as queries
 */
router.delete("/deleteAReply/:movieId/:threadId/:commentId?/:replyId?", async (req, res) => {
    console.log("Req: /deleteAReply/:movieId/:threadId/", req.params.movieId, req.params.threadId, req.params.replyIds)

    const movieId = req.params.movieId
    const threadId = req.params.threadId
    const commentId = req.params.commentId
    const replyId = req.params.replyId
    deleteAcommentOrAReply(req.user._id, movieId, threadId, commentId, replyId, res);

})

router.delete("/deleteAThread/:movieId/:threadId", async (req, res) => {
    console.log("Req: /deleteAThread/:movieId/:threadId/", req.params.movieId, req.params.threadId, req.params.replyIds)

    const movieId = req.params.movieId
    const threadId = req.params.threadId

    try {
        const movieThreadBoard = await allMovieThreads.findOne({ _id: movieId })
        if (movieThreadBoard) {
            let thread = movieThreadBoard.threads.id(threadId)
            if (thread.replies && thread.replies.length > 0) { //only remove user data
                thread.userName = "Deleted User"

                movieThreadBoard.markModified("threads")
                movieThreadBoard.save(function (err, doc, numEffected) {
                    if (!err) {
                        return res.json({
                            success: true, message: "success",
                            body: (prepThreadResponse(movieThreadBoard.threads.id(threadId)))
                        })
                    } else { console.log(err) }
                })
            } else {
                deleteAThread(req.user._id, movieId, threadId, res);
            }

        } else {
            res.status(404).json({ success: false, message: "not found", body: null })
        }

    } catch (err) {
        console.log(err)
        res.status(500).json({ success: false, message: "internal server error" })
    }

})

export function deleteAcommentOrAReply(authorId, movieId, threadId, commentId, replyId, res) {
    console.log(authorId, movieId, threadId, commentId)
    try {
        if (replyId) { //deleteing a reply
            allMovieThreads.findByIdAndUpdate({
                _id: movieId
            }, {
                "$pull": { "threads.$[i].replies.$[j].replies": { _id: replyId } },
            }, {
                arrayFilters: [
                    { "i._id": threadId },
                    { "j._id": commentId }, //comment id
                ], new: true,
                projection: {
                    "threads": {
                        $elemMatch: { "_id": threadId }
                    }
                }
            }, (err, doc) => {
                if (doc) {
                    //deleting a record from user
                    usersCollection.updateMany({ _id: ObjectId(authorId) },
                        { "$pull": { "posts": { "replyId": replyId } } }).then();

                    res.json({ success: true, message: "success", body: prepThreadResponse(doc.threads[0]) });
                } else {
                    console.log(err);
                }
            });
        } else {
            //deleting a comment
            allMovieThreads.findByIdAndUpdate({
                _id: movieId
            }, {
                '$pull': { 'threads.$[i].replies': { _id: commentId } },
            }, {
                arrayFilters: [
                    { "i._id": threadId }, //thread id
                ], new: true,
                projection: {
                    "threads": {
                        $elemMatch: { "_id": threadId }
                    }
                }
            }, (err, doc) => {
                if (doc) {
                    //delete comments form user record, this include all user's replies to that comment
                    console.log(commentId);
                    usersCollection.updateMany({ _id: ObjectId(authorId) },
                        { "$pull": { "posts": { "commentId": commentId } } }).then();


                    res.json({ success: true, message: "success", body: prepThreadResponse(doc.threads[0]) });
                } else {
                    console.log(err);
                }
            });
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "internal server error" });
    }
}

export function deleteAThread(authorId, movieId, threadId, res) {
    console.log(authorId, "--------")
    allMovieThreads.updateOne({
        _id: movieId
    }, {
        '$pull': { 'threads': { _id: threadId } },
    }, (err, doc) => {
        if (!err) {
            //deleting a record from user
            usersCollection.updateMany({ _id: ObjectId(authorId) },
                { "$pull": { "posts": { "threadId": threadId } } }).then();

            res.json({ success: true, message: "success", body: null });
        } else {
            console.log(err);
            res.status(500).json({ success: false, message: "internal server error" });
        }
    });
}

router.post("/postAReply/:movieId/:threadId/:commentId?", async (req, res) => {
    console.log("Req: /postAReply/:movieId/:threadId", req.params.movieId, req.params.threadId)

    const movieId = req.params.movieId
    const threadId = req.params.threadId
    const commentId = req.params.commentId //only if it the request is a reply request
    //add date
    req.body.postDate = Date.now()
    req.body._id = getNewId()

    if (commentId) {//comment id exists, so this is adding a new reply to a existing comment
        //add a reply
        allMovieThreads.findOneAndUpdate({ _id: movieId },
            { "$push": { "threads.$[i].replies.$[j].replies": req.body } },
            {
                arrayFilters: [
                    { "i._id": threadId },
                    { "j._id": commentId }
                ], new: true,
                projection: {
                    "threads": {
                        $elemMatch: { "_id": threadId }
                    }
                }
            },
            (err, doc) => {
                if (!err) {
                    //add a record to user
                    usersCollection.findOne({ _id: ObjectId(req.user._id) }, (err, user) => {
                        user.posts.push({
                            postType: "reply", //thread, comment, reply
                            movieId,
                            threadId,
                            commentId,
                            replyId: req.body._id
                        })
                        user.save()
                    })

                    res.json({ success: true, message: "success", body: prepThreadResponse(doc.threads[0]) })
                } else {
                    console.log(err)
                    res.status(500).json({ success: false, message: "internal server error" })
                }
            })
    } else {
        //add a comment
        allMovieThreads.findOneAndUpdate({ _id: movieId },
            { "$push": { "threads.$[i].replies": req.body } },
            {
                arrayFilters: [{ "i._id": threadId }], new: true,
                projection: {
                    "threads": {
                        $elemMatch: { "_id": threadId }
                    }
                }
            },
            (err, doc) => {
                if (!err) {
                    //add a record to user
                    usersCollection.findOne({ _id: ObjectId(req.user._id) }, (err, user) => {
                        user.posts.push({
                            postType: "comment", //thread, comment, reply
                            movieId,
                            threadId,
                            commentId: req.body._id
                        })
                        user.save()
                    })

                    res.json({ success: true, message: "success", body: prepThreadResponse(doc.threads[0]) })
                } else {
                    console.log(err)
                    res.status(500).json({ success: false, message: "internal server error" })
                }
            })
    }

})

router.put("/updateAReply/:movieId/:threadId/:commentId?/:replyId?", async (req, res) => {
    console.log("Req: /updateAReply/:movieId/:threadId", req.params.movieId, req.params.threadId)

    const movieId = req.params.movieId
    const threadId = req.params.threadId
    const commentId = req.params.commentId
    const replyId = req.params.replyId

    let doc = null

    if (replyId) {//updating a reply
        doc = await allMovieThreads.findOneAndUpdate({
            _id: movieId,
            "threads._id": threadId,
            "threads.replies._id": commentId,
            "threads.replies.replies._id": replyId
        }, {
            "$set":
            {
                "threads.$[i].replies.$[j].replies.$[k].postText": req.body.postText,
                "threads.$[i].replies.$[j].replies.$[k].edited": true,
            },
        }, {
            arrayFilters: [
                { "i._id": threadId },
                { "j._id": commentId },
                { "k._id": replyId }
            ],
            new: true,
            projection: {
                "threads": {
                    $elemMatch: { "_id": threadId }
                }
            }
        })
    } else {
        //updating a comment
        doc = await allMovieThreads.findOneAndUpdate({
            _id: movieId,
            "threads._id": threadId,
            "threads.replies._id": commentId,
        }, {
            "$set":
            {
                "threads.$[i].replies.$[j].postText": req.body.postText,
                "threads.$[i].replies.$[j].edited": true,
            },
        }, {
            arrayFilters: [
                { "i._id": threadId },
                { "j._id": commentId },
            ],
            new: true,
            projection: {
                "threads": {
                    $elemMatch: { "_id": threadId }
                }
            }
        })
    }

    console.log(doc)
    if (doc) {
        res.json({ success: true, message: "success", body: prepThreadResponse(doc.threads[0]) })
    } else {
        console.log(err)
        res.status(500).json({ success: false, message: "internal server error" })
    }
})


function prepThreadResponse(thread) {
    if (thread && thread.replies) {
        thread.replies.sort((a, b) => a.postDate > b.postDate ? -1 : 1)
    }
    return thread
}


/**
 * when a user clicks on "starts a thread" in the movie page
 */
router.post("/postAThread/:movieId", async (req, res) => {
    try {
        //threads id is added to an array in aan object having the same as id movie as the movie it belongs to
        //check if the movie object exists, if not create one 

        if (!validateThreadSubmission(req.body)) {
            return res.status(400).json({ success: false, message: "invalid params", body: req.body })
        }

        //create new id and date for the thread, and adding user info
        req.body._id = getNewId()
        req.body.postDate = Date.now()
        req.body.userId = req.user._id
        req.body.userName = req.user.username

        allMovieThreads.findOneAndUpdate({ _id: req.params.movieId }, {
            '$push': { 'threads': req.body },
            //Options: create new if doesn't exist, and return new doc
        }, { upsert: true, new: true }, (err, doc) => {
            if (err) console.log(err);

            //add a record to user
            usersCollection.findOne({ _id: ObjectId(req.user._id) }, (err, user) => {
                user.posts.push({
                    postType: "thread", //thread, comment, reply
                    movieId: req.params.movieId,
                    threadId: req.body._id
                })
                user.save()
            })


            res.json({
                success: true, message: "thread added",
                body: { threads: (doc ? doc.threads : []) }
            })
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: "internal server error" })
    }

})

function getNewId() {
    return new mongoose.Types.ObjectId().toString() + crypto.randomBytes(5).toString('hex')
}

/**
 * when a user clicks on "Edit a thread" in the thread page
 */
router.put("/updateAThread/:movieId", async (req, res) => {
    try {
        //threads id is added to an array in aan object having the same as id movie as the movie it belongs to
        //check if the movie object exists, if not create one 
        const movieThreadBoard = await allMovieThreads.findOne({ _id: req.params.movieId })

        if (!validateThreadSubmission(req.body)) {
            return res.status(400).json({ success: false, message: "invalid params", body: req.body })
        }
        const thread = movieThreadBoard.threads.id(req.body._id)
        thread.threadType = req.body.threadType
        thread.postTitle = req.body.postTitle
        thread.postText = req.body.postText
        thread.userRating = req.body.userRating
        thread.spoilers = req.body.spoilers
        thread.edited = true
        movieThreadBoard.markModified("threads")
        movieThreadBoard.save()
        return res.json({ success: true, message: "thread updated", body: prepThreadResponse(thread) })

    } catch (e) {
        console.log(e)
        res.status(500).json({ success: false, message: "internal server error" })
    }

})

function validateThreadSubmission(thread) {
    console.log(thread.threadType, thread.postTitle, thread.postText)

    if (!thread.threadType || !thread.postTitle || !thread.postText || !thread.userRating
        || thread.userRating < 0 || thread.userRating > 10) {
        return false
    }
    return true
}


let movieListCount = 0
function getMoviesInTheater() {
    try {
        nowPlayingIMDBIds = []
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=72b9bcf18cd9dc3266097b5cef3d2253&language=en-US&page=1`)
            .then((response) => response.json())
            .then((data) => {
                movieListCount = data.results.length

                data.results.forEach((element) => {
                    console.log(element.id)

                    fetch(`https://api.themoviedb.org/3/movie/${element.id}?api_key=72b9bcf18cd9dc3266097b5cef3d2253&language=en-US`)
                        .then((response) => response.json())
                        .then((data) => {
                            nowPlayingIMDBIds.push(data.imdb_id)
                        });
                });

            });
    } catch (e) {
        console.log(e)
        nowPlayingIMDBIds = defaultFeaturedMovieIds

    }

}


export function deleteAPost(req, res) {
    const authorId = req.params.authorId
    const movieId = req.params.movieId
    const threadId = req.params.threadId
    const commentId = req.params.commentId
    const replyId = req.params.replyId

    if (!authorId) {
        return res.status(401).json({ success: false, message: "Unauthorised" })
    }


    if (replyId && commentId) {
        deleteAcommentOrAReply(authorId, movieId, threadId, commentId, replyId, res)
    } else if (commentId) {
        deleteAcommentOrAReply(authorId, movieId, threadId, commentId, null, res)
    } else {
        deleteAThread(authorId, movieId, threadId, res)
    }
}


const moviesDataRoute = router
export { moviesDataRoute }
