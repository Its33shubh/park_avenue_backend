const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const { getDashboard } = require("../controllers/dashboardController");
const {getUsers,updateUserRole} = require("../controllers/userController");
  

// Only Admin Access
router.get("/dashboard",authMiddleware,roleMiddleware("admin"),getDashboard);

//user routes
router.get("/users", authMiddleware, roleMiddleware("admin"), getUsers);
  
router.patch("/users/role/:id", authMiddleware, roleMiddleware("admin"), updateUserRole);

// router.delete("/users/:id", authMiddleware, roleMiddleware("admin"), deleteUser);

// router.patch("/users/status/:id", authMiddleware, roleMiddleware("admin"), toggleUserStatus);

module.exports = router;