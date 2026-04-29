const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-birthDate");

    res.json({
      error: false,
      success: true,
      count: users.length,
      data: users
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message
    });
  }
}

exports.updateUserRole = async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
  
      // 🔹 validate role
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({
          error: true,
          success: false,
          message: "Invalid role"
        });
      }
  
      // 🔹 find user
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({
          error: true,
          success: false,
          message: "User not found"
        });
      }
  
      // 🔥 SAME ROLE CHECK (IMPORTANT)
      if (user.role === role) {
        return res.status(400).json({
          error: true,
          success: false,
          message: `User already has role '${role}'`
        });
      }
  
      // 🔹 update role
      user.role = role;
      await user.save();
  
      res.json({
        error: false,
        success: true,
        message: "User role updated",
        data: user
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success: false,
        message: error.message
      });
    }
}

exports.toggleUserStatus = async (req, res) => {
    try {
      const { id } = req.params;
  
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({
          error: true,
          success: false,
          message: "User not found"
        });
      }
  
      user.isActive = !user.isActive;
      await user.save();
  
      res.json({
        error: false,
        success: true,
        message: `User ${user.isActive ? "activated" : "blocked"}`,
        data: user
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success: false,
        message: error.message
      });
    }
}