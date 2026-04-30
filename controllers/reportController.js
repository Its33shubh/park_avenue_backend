const Order = require("../models/Order");

exports.getMonthlyReport = async (req, res) => {
  try {
    const { year, month } = req.query;

    //  validation
    if (!year || !month) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Year and month are required"
      });
    }
    //
    if (month < 1 || month > 12) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid month"
        });
      }

    //  month range
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    //  fetch data
    const orders = await Order.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ createdAt: 1 });

    //  format report
    let report = orders.map((order, index) => {
      const totalItems = order.items.reduce((sum, item) => {
        return sum + item.quantity;
      }, 0);

      return {
        sr: index + 1,
        date: order.createdAt.toISOString().split("T")[0],
        name: order.userName,
        phone: order.phone,
        tableNumber: order.tableNumber,
        totalItems,
        totalBill: order.totalAmount
      };
    });
    // no data available for req. date and month
    if (report.length === 0) {

        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];

          const monthName = monthNames[month - 1];

        return res.json({
          error: false,
          success: true,
          message: `No orders found for ${monthName} ${year}`,
          count: 0,
          data: []
        });
      }

    res.json({
      error: false,
      success: true,
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