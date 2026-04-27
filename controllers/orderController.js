const Order = require("../models/Order");
const Product = require("../models/Product");

//CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { userName, phone, tableNumber, items } = req.body;
    if (!userName || !phone || !tableNumber || !items || items.length === 0) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "All fields are required"
      });
    }

    let totalAmount = 0;

    // calculate total (FAST)
    const productIds = items.map(item => item.product);

    const products = await Product.find({ _id: { $in: productIds } });
    //fast lookup 
    const productMap = {};
    products.forEach(p => {
      productMap[p._id] = p;
    });

    for (let item of items) {
      const product = productMap[item.product];

      if (!product) {
        return res.status(404).json({
          error: true,
          success: false,
          message: "Product not found"
        });
      }

      totalAmount += product.price * item.quantity;
    }
    const order = await Order.create({
      userName,
      phone,
      tableNumber,
      items,
      totalAmount
    });

    res.status(201).json({
      error: false,
      success: true,
      message: "Order placed successfully",
      data: order
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message
    });
  }
}

// GET ALL ORDERS (ADMIN)
exports.getOrders = async (req, res) => {
  try {

    const { status } = req.query;

    let filter = {};

    // filter by status (optional)
    if (status) {
      filter.status = status; // pending / accepted / rejected
    }

    const orders = await Order.find(filter)
      .populate("items.product", "name price image") 
      .sort({ createdAt: -1 }); 

    res.status(200).json({
      error: false,
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message
    });
  }
}

//  ACCEPT ORDER
exports.acceptOrder = async (req, res) => {
    try {
      const { id } = req.params;
  
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({
          error: true,
          success: false,
          message: "Order not found"
        });
      }
  
      //  already processed
      if (order.status !== "pending") {
        return res.status(400).json({
          error: true,
          success: false,
          message: `Order already ${order.status}`
        });
      }
  
      order.status = "accepted";
      await order.save();
  
      res.json({
        error: false,
        success: true,
        message: "Order accepted",
        data: {
          id: order._id,
          status: order.status
        }
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success: false,
        message: error.message
      });
    }
}
