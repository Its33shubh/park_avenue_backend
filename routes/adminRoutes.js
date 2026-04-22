const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Only Admin Access
router.get("/dashboard", authMiddleware, roleMiddleware("admin"), (req, res) => {

  res.json({
    success: true,
    message: `Welcome ${req.user.name} as Admin` 
  });
});

module.exports = router;