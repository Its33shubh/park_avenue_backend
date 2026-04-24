const Product = require("../models/Product");
const Category = require("../models/Category");
const { uploadImage } = require("../utils/uploadToCloudinary");

exports.addProduct = async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
  
      if (!name || !price || !category) {
        return res.status(400).json({
          error: true,
          success:false,
          message: "Name, price and category required"
        });
      }
  
      const categoryData = await Category.findById(category);
      if (!categoryData) {
        return res.status(404).json({
          error: true,
          success:false,
          message: "Category not found"
        });
      }
  
      let imageUrl = "";
  
      if (req.file) {
        imageUrl = await uploadImage(
          req.file,
          `park_avenue/products/${categoryData.name.toLowerCase()}`
        );
      }
  
      const product = await Product.create({
        name: name.trim(),
        description,
        price,
        category,
        image: imageUrl
      });
  
      res.status(201).json({
        error:false,
        success: true,
        message: "Product added",
        data: product
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success:false,
        message: error.message
      });
    }
}
  