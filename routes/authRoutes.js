const express = require("express");
const router = express.Router();


const { Register, Login } = require("../controllers/authController");
const authMiddleware = require('../middleware/authMiddleware')



router.post("/register", Register);
router.post("/login", Login);
router.get("/profile", authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user
    })
})

module.exports = router;