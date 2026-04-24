const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {addProduct,getProducts,updateProduct,deleteProduct} = require("../controllers/productController");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");


router.post("/add", authMiddleware, roleMiddleware("admin"), upload.single("image"), addProduct)

router.get("/get", getProducts);
router.put("/update/:id", authMiddleware, roleMiddleware("admin"), upload.single("image"), updateProduct)
router.delete("/delete/:id", authMiddleware, roleMiddleware("admin"), deleteProduct)
// router.put("/toggle/:id", authMiddleware, roleMiddleware("admin"), toggleAvailability);

module.exports = router;