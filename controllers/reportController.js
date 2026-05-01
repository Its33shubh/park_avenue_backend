const Order = require("../models/Order")

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
    const { year, month, startDate, endDate,userId } = req.query;

    let filter = {};

    // date filter
    if (startDate && endDate) {

      // format validation
      if (!isValidDateStrict(startDate) || !isValidDateStrict(endDate)) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid date format (YYYY-MM-DD required)"
        });
      }

      const start = new Date(startDate);
      const end = new Date(endDate);

      // logical validation
      if (start > end) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "startDate cannot be greater than endDate"
        });
      }

      // full-day fix 
      end.setDate(end.getDate() + 1);

      filter.createdAt = {
        $gte: start,
        $lt: end
      };
    }
    //   MONTH FILTER
    else {

      if (!year || !month) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Provide (year & month) OR (startDate & endDate)"
        });
      }

      const y = Number(year);
      const m = Number(month);

      // validation
      if (isNaN(y) || y < 2000 || y > 2100) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid year"
        });
      }

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
    // user filter
    if (userId) {
      filter.user = userId;
    }
    // FETCH DATA
    const orders = await Order.find(filter)
    .populate("user","_id name")
    .sort({ createdAt: 1 });
    //  FORMAT DATE
    const report = orders.map((order, index) => {
      const totalItems = order.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        sr: index + 1,
        userId: order.user?._id,   
        name: order.user?.name || order.userName,
        phone: order.phone,
        tableNumber: order.tableNumber,
        totalItems,
        totalBill: order.totalAmount,
        date: order.createdAt.toISOString().split("T")[0]
      }
    })

    // 
    // NO DATA HANDLING
    if (report.length === 0) {

      let message = "No orders found";

      if (startDate && endDate) {
        message = `No orders found between ${startDate} to ${endDate}`;
      } else {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        const monthName = monthNames[Number(month) - 1];
        message = `No orders found for ${monthName} ${year}`;
      }

      return res.json({
        error: false,
        success: true,
        message,
        count: 0,
        data: []
      });
    }
    //  SUCCESS RESPONSE
    res.json({
      error: false,
      success: true,
      message: "Report fetched successfully",
      count: report.length,
      data: report
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message
    });
  }
}