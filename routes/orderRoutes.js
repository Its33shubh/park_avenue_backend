const express = require("express");
const router = express.Router();

const {createOrder} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// CREATE ORDER (user)
router.post("/create", createOrder);

// // GET ALL ORDERS
// router.get("/get", authMiddleware, roleMiddleware("admin"), getOrders);

// // ACCEPT ORDER
// router.patch("/accept/:id", authMiddleware, roleMiddleware("admin"), acceptOrder);

// // REJECT ORDER
// router.patch("/reject/:id", authMiddleware, roleMiddleware("admin"), rejectOrder);


module.exports = router;