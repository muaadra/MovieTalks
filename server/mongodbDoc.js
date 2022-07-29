//list collections/tables
const u = await db.listCollections().toArray()

//list objects in a collecton/table
const data = await db.collection('movies').find().toArray();




//--------***update field in replies of a comment **-----
//update field in nested arrays

//update field in replies of a comment
const doc = await allMovieThreads.findOneAndUpdate({
    _id: "tt0111161",
    "threads._id": "thread_2_Id",
    "threads.replies._id": "62c40544f00dfee92b75ccb1059e6c8940",
    "threads.replies.replies._id": "62c4054ef00dfee92b75ccb748af2af29a"
}, {
    '$set': { 'threads.$[i].replies.$[j].replies.$[k].postText': 'updated item2xxx--22***' },
}, {
    arrayFilters: [
        { "i._id": "thread_2_Id" },
        { "j._id": "62c40544f00dfee92b75ccb1059e6c8940" },
        { "k._id": "62c4054ef00dfee92b75ccb748af2af29a" }
    ]
})



//--------***removing/deleting element from array**-----
//deleteing a relpy
await allMovieThreads.updateOne({
    _id: "tt0111161"
}, {
    '$pull': { 'threads.$[i].replies.$[j].replies': { _id: "62c40548f00dfee92b75ccb4c151d1efb0" } },
}, {
    arrayFilters: [
        { "i._id": "thread_2_Id" }, //thread id
        { "j._id": "62c40544f00dfee92b75ccb1059e6c8940" }, //comment id
    ]
})

//delete a comment
await allMovieThreads.updateOne({
    _id: "tt0111161"
}, {
    '$pull': { 'threads.$[i].replies': { _id: "62c4053ff00dfee92b75ccae228badc866" } },
}, {
    arrayFilters: [
        { "i._id": "thread_2_Id" }, //thread id
    ]
})

//delete a thread
await allMovieThreads.updateOne({
    _id: "tt0111161"
}, {
    '$pull': { 'threads': { _id: "thread_2_Id" } },
})


//--------***pushing element to array**-----
//insert new thread
await allMovieThreads.updateOne({
    _id: "tt0111161"
}, {
    '$push': { 'threads': threadObj },
})

//add a comment
await allMovieThreads.updateOne({
    _id: "tt0111161"
}, {
    '$push': { 'threads.$[i].replies': replyObj },
},
    {
        arrayFilters: [{ "i._id": "newThread" }]
    }
)

//add a reply
await allMovieThreads.updateOne({
    _id: "tt0111161"
}, {
    '$push': { 'threads.$[i].replies.$[j].replies': replyObj },
},
    {
        arrayFilters: [
            { "i._id": "newThread" }, //thread id
            { "j._id": "Commment_ID_11" }, //comment id
        ]
    }
)


//--get threads/comments/replies

//get a thread
await allMovieThreads.findOne({ "threads._id": "thread_2_Idvv" }, { "threads.$": 1 })
//console.log(doc)

//get a comment
await allMovieThreads.aggregate([
    { "$match": { _id: "tt0111161" } },
    { "$unwind": "$threads" },
    { "$match": { "threads._id": "thread_2_Id" } },
    { "$unwind": "$threads.replies" },
    { "$match": { "threads.replies._id": "62c4053ff00dfee92b75ccae228badc866", } },
    {
        "$project": {
            "threads.replies": 1
        }
    }
])//console.log(doc[0])

//get a reply
await allMovieThreads.aggregate([
    { "$match": { _id: "tt0111161" } },
    { "$unwind": "$threads" },
    { "$match": { "threads._id": "thread_2_Id" } },
    { "$unwind": "$threads.replies" },
    { "$match": { "threads.replies._id": "62c40544f00dfee92b75ccb1059e6c8940", } },
    { "$unwind": "$threads.replies.replies" },
    { "$match": { "threads.replies.replies._id": "62c40548f00dfee92b75ccb4c151d1efb0", } },
    {
        "$project": {
            "threads.replies.replies": 1
        }
    }
])//console.log(doc[0].threads)

//get a thread


//****deleting recors from user collection */
//deleting item from array

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

//pull from array
admin.updateOne({}, {
    '$pull': { "movieSubmissions": { _id: ObjectId(req.body.adminMovieId) } },
}, (err, doc) => {
    console.log(err)
})
