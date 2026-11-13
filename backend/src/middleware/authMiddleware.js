import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
    try {
        let authHeader = req.headers.authorization
        let token = authHeader.split(" ")[1]

        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = decoded

        next()
    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Not authorized.",
        })
    }
}

export default authMiddleware
