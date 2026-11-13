import "dotenv/config"
import express, { json } from "express"
import cors from "cors"
import connectToDb from "./src/connectToDb.js"
import authRoute from "./src/routes/authRoute.js"
import contactRoute from "./src/routes/contactRoute.js"
import authMiddleware from "./src/middleware/authMiddleware.js"

let app = express()

app.use(cors())
app.use(json())
app.use("/uploads", express.static("uploads"))

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Contact Manager backend is running",
        result: null,
    })
})

app.use("/auth", authRoute)
app.use("/contacts", authMiddleware, contactRoute)

app.listen(process.env.PORT, () => {
    console.log(`application is listening at port ${process.env.PORT}`)
    connectToDb()
})
