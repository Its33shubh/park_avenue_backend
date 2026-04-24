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

exports.getProducts = async (req, res) => {
    try {
      const { category } = req.query;
  
      let filter = {};
      if (category) {
        filter.category = category;
      }
  
      const products = await Product.find(filter)
        .populate("category", "name image")
        .sort({ createdAt: -1 });
  
      res.json({
        error:false,
        success: true,
        count: products.length,
        data: products
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success:false,
        message: error.message
      });
    }
}

exports.updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, category } = req.body;
  
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          error: true,
          success:false,
          message: "Product not found"
        });
      }
  
      let imageUrl = product.image;
  
      if (req.file) {
        const categoryData = await Category.findById(category || product.category);
  
        imageUrl = await uploadImage(
          req.file,
          `park_avenue/products/${categoryData.name.toLowerCase()}`
        );
      }
  
      const updated = await Product.findByIdAndUpdate(
        id,
        {
          name: name?.trim() || product.name,
          description,
          price,
          category: category || product.category,
          image: imageUrl
        },
        { new: true }
      );
  
      res.json({
        error:false,
        success: true,
        message: "Product updated",
        data: updated
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success:false,
        message: error.message
      });
    }
  
}

exports.deleteProduct = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({
          error: true,
          success:false,
          message: "Product not found"
        });
      }
  
      await Product.findByIdAndDelete(id);
  
      res.json({
        error:false,
        success: true,
        message: "Product deleted"
      });
  
    } catch (error) {
      res.status(500).json({
        error: true,
        success:false,
        message: error.message
      });
    }
}

exports.toggleAvailability = async (req, res) => {
    try {
      const { id } = req.params;
  
      const product = await Product.findById(id);
  
      product.isAvailable = !product.isAvailable;
      await product.save();
  
      res.json({
        error:false,
        success: true,
        message: "Availability updated",
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
  
  