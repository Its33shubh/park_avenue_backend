const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");

exports.getDashboard = async (req, res) => {
  try {

    const [
      totalProducts,
      totalCategories,
      recentProducts,
      pendingOrders,
      recentOrders
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(5),

      //pending orders
      Order.countDocuments({ status: "pending" }),

      //recent order 
      Order.find()
        .populate("items.product", "name")
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    res.json({
      error: false,
      success: true,
      data: {
        totalProducts,
        totalCategories,
        pendingOrders,   
        recentProducts,
        recentOrders     
      }
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message
    });
  }
};