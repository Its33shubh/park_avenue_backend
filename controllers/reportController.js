const Order = require("../models/Order")
const mongoose = require('mongoose')

//  ISO date validation (YYYY-MM-DD)
function isValidDateStrict(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  const [year, month, day] = dateString.split("-").map(Number);

  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month, startDate, endDate, userId,minAmount, maxAmount } = req.query;

    let filter = {};

    // AT LEAST ONE FILTER REQUIRED
    if (!startDate && !endDate && !year && !month && !userId &&!minAmount && !maxAmount) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Provide at least one filter"
      });
    }


    //  DATE FILTER
     if (startDate && endDate) {

      if (!isValidDateStrict(startDate) || !isValidDateStrict(endDate)) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid date format (YYYY-MM-DD required)"
        });
      }

      const start = new Date(startDate)
      const end = new Date(endDate)

      if (start > end) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "startDate cannot be greater than endDate"
        });
      }

      end.setDate(end.getDate() + 1)

      filter.createdAt = {
        $gte: start,
        $lt: end
      };
    }

   
    // MONTH FILTER (only if date not given)
    
    if (!startDate && !endDate && year && month) {

      const y = Number(year)
      const m = Number(month)

      // 🔥 YEAR VALIDATION
      if (isNaN(y) || y < 2000 || y > 2100) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid year"
        });
      }

      // 🔥 MONTH VALIDATION
      if (isNaN(m) || m < 1 || m > 12) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid month"
        });
      }

      const start = new Date(y, m - 1, 1);
      const end = new Date(y, m, 0, 23, 59, 59);

      filter.createdAt = {
        $gte: start,
        $lte: end
      };
    }

    //  USER ID FILTER
    if (userId) {

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid userId"
        });
      }

      filter.user = userId
    }
    // bill price 
    if ((minAmount && isNaN(minAmount)) || (maxAmount && isNaN(maxAmount))) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Invalid amount value"
      });
    }

    if (minAmount || maxAmount) {
      filter.totalAmount = {};

      if (minAmount) {
        filter.totalAmount.$gte = Number(minAmount);
      }

      if (maxAmount) {
        filter.totalAmount.$lte = Number(maxAmount);
      }
    }
    //  FETCH DATA
    
    const orders = await Order.find(filter)
      .populate("user", "_id name")
      .sort({ createdAt: 1 });

    // FORMAT
    const report = orders.map((order, index) => {
      const totalItems = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        sr: index + 1,
        userId: order.user?._id || null,
        name: order.user?.name || order.userName,
        phone: order.phone,
        tableNumber: order.tableNumber,
        totalItems,
        totalBill: order.totalAmount,
        date: order.createdAt.toISOString().split("T")[0]
      }
    })

    // no data
    if (report.length === 0) {
      return res.json({
        error: false,
        success: true,
        message: "No orders found",
        count: 0,
        data: []
      })
    }

      //  SUCCESS
    res.json({
      error: false,
      success: true,
      message: "Report fetched successfully",
      count: report.length,
      data: report
    })

  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message
    })
  }
}