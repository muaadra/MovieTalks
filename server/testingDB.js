
import allMovieThreads from './models/thread.js';
import usersCollection from './models/user.js';
import { ObjectId } from 'mongodb';

async function testdb() {
    //startAThread()

    // const doc = await allMovieThreads.findOne({ "threads._id": "thread_2_Idvv" }, { "threads.$": 1 })
    console.log("----")

    //delete comments form user record, this include all user's replies to that comment
    usersCollection.updateMany({
        _id: ObjectId("62c7099d94d8676ceae2d353"),
    },
        { "$pull": { "posts": { "commentId": "62c7a0864b46e3c283a65af8f12ff51d3a" } } }, (err, doc) => {
            console.log(err)

        })

    //delete a thread form user record, this include all user's replies/comment on that thread
    usersCollection.updateMany({
        _id: ObjectId("62c7099d94d8676ceae2d353"),
    },
        { "$pull": { "posts": { "threadId": "62c79866b86548e914625f9b5e2ff69c56" } } }, (err, doc) => {
            console.log(err)

        })

    //delete a reply form user record
    usersCollection.updateMany({
        _id: ObjectId("62c7099d94d8676ceae2d353"),
    },
        { "$pull": { "posts": { "replyId": "62c7a0864b46e3c283a65af8f12ff51d3a" } } }, (err, doc) => {
            console.log(err)

        })

}

export default function runTest() {
    //testdb()
}

let threadObj = {
    "_id": "ThreadID",
    "threadType": "ReviewNewY",
    "voteCount": 0,
    "postDate": 1657013562838,
    "postTitle": "asfcxxxNew",
    "postText": "waecxxxNew",
    "spoilers": true,
    "userRating": 8,
    "userId": "62c25841fxxxNew",
    "userName": "AdminxNewx",
    "replies": []
}

let replyObj = {
    "_id": "newREEPPLYYYxx",
    "repliedTo": "62c4053af00d",
    "userId": "62c25841fc9f344b5ad5fef0",
    "userName": "Admin",
    "postTitle": "Comment",
    "postText": "fwqfwqefReply",
    "postDate": 16570234
}

function startAThread() {
    allMovieThreads.create({
        "_id": "tt0111161xx",
        "threads": [
            {
                "_id": "thread_1_Idxx",
                "threadType": "Reviewxx",
                "voteCount": 0,
                "postDate": 1657013562838,
                "postTitle": "asfcxxx",
                "postText": "waecxxx",
                "spoilers": true,
                "userRating": 8,
                "userId": "62c25841fxxx",
                "username": "Adminxx",
                "replies": []
            },
            {
                "_id": "thread_2_Idvv",
                "threadType": "Review",
                "voteCount": 0,
                "postDate": 1657013562838,
                "postTitle": "asfcwfc",
                "postText": "waqfcaswec",
                "spoilers": true,
                "userRating": 8,
                "userId": "62c25841fc9f344b5ad5fef0",
                "username": "Admin",
                "replies": [
                    {
                        "_id": "62c4053ff00dfee92b75ccae228badc866",
                        "repliedTo": "62c4053af00dfee92b75ccaa4764c4dc9c",
                        "userId": "62c25841fc9f344b5ad5fef0",
                        "userName": "Admin",
                        "postTitle": "Comment",
                        "postText": "fwqfwqef",
                        "postDate": 1657013567339
                    },
                    {
                        "_id": "62c40544f00dfee92b75ccb1059e6c8940",
                        "repliedTo": "62c4053af00dfee92b75ccaa4764c4dc9c",
                        "userId": "62c25841fc9f344b5ad5fef0",
                        "userName": "Admin",
                        "postTitle": "Comment",
                        "postText": "qwrfqwr",
                        "postDate": 1657013572835,
                        "replies": [
                            {
                                "_id": "62c40548f00dfee92b75ccb4c151d1efb0",
                                "repliedTo": "62c4053af00dfee92b75ccaa4764c4dc9c",
                                "userId": "62c25841fc9f344b5ad5fef0",
                                "userName": "Admin",
                                "postTitle": "Comment",
                                "postText": "ewffwefw",
                                "postDate": 1657013576157
                            },
                            {
                                "_id": "62c4054ef00dfee92b75ccb748af2af29a",
                                "repliedTo": "62c4053af00dfee92b75ccaa4764c4dc9c",
                                "userId": "62c25841fc9f344b5ad5fef0",
                                "userName": "Admin",
                                "postTitle": "Comment",
                                "postText": "qwrfqwrqwr",
                                "postDate": 1657013582437
                            }
                        ]
                    }
                ]
            }
        ]
    })
}
