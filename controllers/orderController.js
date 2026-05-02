const Order = require("../models/Order");
const Product = require("../models/Product");
const Table = require("../models/Table");

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
    // TABLE CHECK + OCCUPY
    const table = await Table.findOne({ tableNumber });

    if (!table) {
      return res.status(404).json({
        error: true,
        success: false,
        message: "Table not found"
      });
    }

    //  already occupied
    if (!table.isAvailable) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Table already occupied"
      });
    }

    //
    let totalAmount = 0;

    const productIds = items.map(item => item.product);

    const products = await Product.find({ _id: { $in: productIds } });

    const productMap = {};
    products.forEach(p => {
      productMap[p._id.toString()] = p;  
    });

    for (let item of items) {

      if (item.quantity <= 0) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Quantity must be greater than 0"
        });
      }

      const product = productMap[item.product.toString()]; // 

      if (!product) {
        return res.status(404).json({
          error: true,
          success: false,
          message: "Product not found"
        });
      }

      totalAmount += product.price * item.quantity;
    }
    //TABLE OCCUPY 
    table.isAvailable = false;
    await table.save();

    const order = await Order.create({
      user: req.user.id || null,
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


// REJECT ORDER
exports.rejectOrder = async (req, res) => {
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
  
      order.status = "rejected";
      await order.save();
      
      //table free 
      const table = await Table.findOne({ tableNumber: order.tableNumber });

      if (table) {
        table.isAvailable = true;
        await table.save();
      }
  
      res.json({
        error: false,
        success: true,
        message: "Order rejected & table freed",
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