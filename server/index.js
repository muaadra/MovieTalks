/**
 * This file is for server settup with Express.js, MongoDB, and Passport.Js
 */
const port = 80
import express from 'express'
const app = express()
import passport from "passport"
import session from "express-session"
import MongoStore from 'connect-mongo'
import cors from 'cors';
import initializePassport from "./passportConfig.js"
import { setMoviesDb } from "./tools/moviesDbSetup.js"
import mongoose from 'mongoose';
import testdb from "./testingDB.js"

app.use(express.json());
app.use(cors());

//setup passport.js
app.use(session({
    secret: "process.env.SESSION_SECRET",
    store: MongoStore.create({
        mongoUrl: "mongodb://localhost:27017",
        dbName: 'project'
    }),
    resave: false,
    saveUninitialized: false,
}))
app.use(passport.initialize())
app.use(passport.session())

//serve static files, the react build folder
app.use("/", express.static("../client/build"))
app.use("/profile/admin", express.static("../client/build"))
app.use("/profile", express.static("../client/build"))
app.use("/auth/resetByEmail/", express.static("../client/build"))
app.use("/assets/userImages/", express.static("/assets/userImages/"));
app.use("/thread", express.static("../client/build"))
app.use("/searchAllByFilters", express.static("../client/build"))
app.use("/searchResults", express.static("../client/build"))
app.use("/moviePage", express.static("../client/build"))
app.use("/watchlist", express.static("../client/build"))

/**  -----ROUTES----- **/
import { router as authRoutes } from './routes/auth.js' //roters for the login (auth) system
import { moviesDataRoute } from "./routes/moviesData.js"
import { userRating } from "./routes/userRating.js"
import { userProfile } from "./routes/userProfile.js"
import { search } from "./routes/search.js"
import { movieSubmissions } from "./routes/admin.js"
import { thread } from "./routes/thread.js"
import { topRatedMovies } from "./routes/topRatedMovies.js"
import { watchList } from "./routes/watchList.js"
import { movieSubmission } from "./routes/movieSubmission.js"
import { featuredMovies } from "./routes/featuredMovies.js"

app.use('/auth', authRoutes)
app.use(moviesDataRoute)
app.use(moviesDataRoute)
app.use(userRating)
app.use(userProfile)
app.use(search)
app.use(movieSubmissions)
app.use(thread)
app.use(topRatedMovies)
app.use(watchList)
app.use(movieSubmission)
app.use(featuredMovies)
/**  -----//----- **/

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
})

// connect to db
export let db;
async function connectToDb() {
    await mongoose.connect('mongodb://localhost:27017/project');
    db = mongoose.connection
    initializePassport(passport, db)
    setMoviesDb()
    testdb()
    console.log("connected to db");
}

connectToDb().catch(err => console.log(err));



