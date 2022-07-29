
import express from 'express'

import allMovieThreads from '../models/thread.js';


export function getReply(movieId, threadId, CommentId, replyId, cb) {
    //get a reply
    allMovieThreads.aggregate([
        { "$match": { _id: movieId } },
        { "$unwind": "$threads" },
        { "$match": { "threads._id": threadId } },
        { "$unwind": "$threads.replies" },
        { "$match": { "threads.replies._id": CommentId, } },
        { "$unwind": "$threads.replies.replies" },
        { "$match": { "threads.replies.replies._id": replyId, } },
        {
            "$project": {
                "threads.replies.replies": 1
            }
        }
    ], (err, doc) => {
        if (doc && doc.length > 0) {
            let newDoc = doc[0].threads.replies.replies
            newDoc.movieId = movieId
            newDoc.threadId = threadId
            newDoc.commentId = CommentId
            newDoc.replyId = replyId
            cb(newDoc)
        } else {
            cb(null)
        }
    })
}


export function getComment(movieId, threadId, CommentId, cb) {
    //get a reply
    allMovieThreads.aggregate([
        { "$match": { _id: movieId } },
        { "$unwind": "$threads" },
        { "$match": { "threads._id": threadId } },
        { "$unwind": "$threads.replies" },
        { "$match": { "threads.replies._id": CommentId, } },
        {
            "$project": {
                "threads.replies": 1
            }
        }
    ], (err, doc) => {
        if (doc && doc.length > 0) {
            let newDoc = doc[0].threads.replies
            newDoc.movieId = movieId
            newDoc.threadId = threadId
            newDoc.commentId = CommentId
            cb(newDoc)
        } else {
            cb(null)
        }
    })
}

export function getThread(movieId, threadId, cb) {
    //get a reply
    allMovieThreads.findOne({ "threads._id": threadId },
        { "threads.$": 1 }, (err, doc) => {
            if (doc) {
                let newDoc = doc.threads[0]
                newDoc.movieId = movieId
                newDoc.threadId = threadId
                cb(newDoc)
            } else {
                cb(null)
            }

        })
}