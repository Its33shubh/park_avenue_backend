const Category = require("../models/Category");
const { uploadImage } = require("../utils/uploadToCloudinary");

exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "Category name required"
      });
    }

    const cleanName = name.trim();

    let imageUrl = "";

    if (req.file) {
      imageUrl = await uploadImage(
        req.file,
        `park_avenue/categories/${cleanName.toLowerCase()}`
      );
    }

    const category = await Category.create({
      name: cleanName,
      image: imageUrl
    });

    res.status(201).json({
      error:false,
      success: true,
      message: "Category added",
      data: category
    });

  } catch (error) {
    res.status(500).json({
      error: true,
      success: false,
      message: error.message
    });
  }
}

exports.getCategories = async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
  
      res.status(200).json({
        error:false,
        success: true,
        count: categories.length,
        data: categories
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success:false,
        message: error.message
      });
    }
  }