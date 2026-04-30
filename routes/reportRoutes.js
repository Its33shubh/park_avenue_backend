const express = require("express");
const router = express.Router();

const { getMonthlyReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

//  Admin only
router.get("/",authMiddleware,roleMiddleware("admin"),getMonthlyReport);

module.exports = router;