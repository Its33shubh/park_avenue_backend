const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { addCategory } = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post( "/add", authMiddleware, roleMiddleware("admin"), upload.single("image"), addCategory);

module.exports = router;