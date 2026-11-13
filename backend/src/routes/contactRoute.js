import { Router } from "express"
import Contact from "../schema/contactSchema.js"
import upload from "../middleware/uploadMiddleware.js"

let contactRoute = Router()

contactRoute
    .route("/")
    .post(async (req, res, next) => {
        try {
            let result = await Contact.create(req.body)
            res.status(200).json({
                success: true,
                message: "Contact created successfully.",
                result: result,
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    })
    .get(async (req, res, next) => {
        try {
            let result = await Contact.find()
            res.status(200).json({
                success: true,
                message: "Contacts read successfully.",
                result: result,
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    })

contactRoute.route("/upload").post(upload.single("photo"), (req, res) => {
    try {
        let photoUrl = process.env.BASE_URL + "/uploads/" + req.file.filename
        res.status(200).json({
            success: true,
            message: "Photo uploaded successfully.",
            result: photoUrl,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

contactRoute.route("/delete-many").post(async (req, res, next) => {
    try {
        let ids = req.body.ids
        let deletedCount = 0

        for (let i = 0; i < ids.length; i++) {
            let deleted = await Contact.findByIdAndDelete(ids[i])

            if (deleted) {
                deletedCount = deletedCount + 1
            }
        }

        res.status(200).json({
            success: true,
            message: "Contacts deleted successfully.",
            result: deletedCount,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

contactRoute
    .route("/:id")
    .get(async (req, res, next) => {
        try {
            let result = await Contact.findById(req.params.id)
            res.status(200).json({
                success: true,
                message: "Contact read successfully.",
                result: result,
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    })
    .patch(async (req, res, next) => {
        try {
            let result = await Contact.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            })
            res.status(200).json({
                success: true,
                message: "Contact updated successfully.",
                result: result,
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    })
    .delete(async (req, res, next) => {
        try {
            let result = await Contact.findByIdAndDelete(req.params.id)
            res.status(200).json({
                success: true,
                message: "Contact deleted successfully.",
                result: result,
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            })
        }
    })

export default contactRoute
