import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../schema/userSchema.js"
import authMiddleware from "../middleware/authMiddleware.js"

let authRoute = Router()

authRoute.route("/register").post(async (req, res) => {
    try {
        let hashedPassword = await bcrypt.hash(req.body.password, 10)

        let result = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })

        res.status(200).json({
            success: true,
            message: "User registered successfully.",
            result: {
                _id: result._id,
                name: result.name,
                email: result.email,
            },
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

authRoute.route("/login").post(async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            })
        }

        let isMatch = await bcrypt.compare(req.body.password, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password.",
            })
        }

        let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        })

        res.status(200).json({
            success: true,
            message: "Login successful.",
            result: {
                token: token,
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

authRoute.route("/profile").get(authMiddleware, async (req, res) => {
    try {
        let user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            })
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully.",
            result: {
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

authRoute.route("/profile").patch(authMiddleware, async (req, res) => {
    try {
        let name = req.body.name

        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Name is required.",
            })
        }

        let user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            })
        }

        user.name = name.trim()
        await user.save()

        res.status(200).json({
            success: true,
            message: "Profile updated successfully.",
            result: {
                name: user.name,
                email: user.email,
            },
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

authRoute.route("/change-password").patch(authMiddleware, async (req, res) => {
    try {
        let currentPassword = req.body.currentPassword
        let newPassword = req.body.newPassword
        let confirmPassword = req.body.confirmPassword

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "All password fields are required.",
            })
        }

        let user = await User.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            })
        }

        let isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect.",
            })
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "New password and confirm password do not match.",
            })
        }

        if (newPassword === currentPassword) {
            return res.status(400).json({
                success: false,
                message: "New password must be different from the current password.",
            })
        }

        let hashedPassword = await bcrypt.hash(newPassword, 10)

        user.password = hashedPassword
        await user.save()

        res.status(200).json({
            success: true,
            message: "Password changed successfully. Please log in again.",
            result: null,
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
})

export default authRoute
