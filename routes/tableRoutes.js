const express = require("express");
const router = express.Router();

const {addTable,getTables,deleteTable,updateTableStatus} = require("../controllers/tableController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// Admin only
router.post("/add", authMiddleware, roleMiddleware("admin"), addTable)
router.get("/get", authMiddleware, roleMiddleware("admin"), getTables)
router.delete("/delete/:id", authMiddleware, roleMiddleware("admin"), deleteTable)
router.patch("/status/:id",authMiddleware,roleMiddleware("admin"),updateTableStatus);

module.exports = router