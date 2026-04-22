const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = async (req, res, next) => {
    try {
        let authHeader = req.headers.authorization

        if (!authHeader || !authHeader.startsWith("Bearer")) {

            return res.status(401).json({
                error: true,
                success: false,
                message: "No Token,Access denied"
            })
        }

        let token = authHeader.split(" ")[1];

        let decoded = jwt.verify(token, process.env.JWT_SECRET)

        let user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).json({
                error: true,
                success: false,
                message: "User Not Found"
            });
        }

        req.user = user;

        next()
    } catch (err) {
        res.status(401).json({
            error: true,
            message: "Invalid token"
        })
    }
}

module.exports = authMiddleware