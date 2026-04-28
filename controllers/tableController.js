const Table = require("../models/Table");

exports.addTable = async (req, res) => {
  try {
    const { tableNumber } = req.body;

    if (!tableNumber) {
      return res.status(400).json({
        error: true,
        success:false,
        message: "Table number required"
      });
    }

    const exists = await Table.findOne({ tableNumber });

    if (exists) {
      return res.status(400).json({
        error: true,
        success:false,
        message: "Table already exists"
      });
    }

    const table = await Table.create({ tableNumber });

    res.json({
        error:false,
      success: true,
      message: "Table added",
      data: table
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      success:false,
      message: error.message
    });
  }
}