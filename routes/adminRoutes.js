const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getDashboard } = require("../controllers/dashboardController");

// Only Admin Access
router.get("/dashboard",authMiddleware,roleMiddleware("admin"),getDashboard);

module.exports = router;