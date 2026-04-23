const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { addCategory,getCategories,updateCategory } = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post( "/add", authMiddleware, roleMiddleware("admin"), upload.single("image"), addCategory);
router.get("/get", getCategories);
router.put("/update/:id",authMiddleware,roleMiddleware("admin"),upload.single("image"),updateCategory);

module.exports = router;