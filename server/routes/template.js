/**
 * 
 * Refrence:
 * Express documentation
 * https://expressjs.com/en/guide/routing.html
 * 
 *  * add the route to Index.js
 */
import express from 'express'
const router = express.Router()

router.get("/test", async (req, res) => {
    res.status(200).json({ success: true, body: "something" })

})


export { router as template }
