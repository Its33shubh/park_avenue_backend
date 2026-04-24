const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.time("MongoDB Connected");
    await mongoose.connect(process.env.MONGO_URI);
    console.timeEnd("MongoDB Connected");
    console.log("MongoDB Connected");

  } catch (error) {
    console.error("DB Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;