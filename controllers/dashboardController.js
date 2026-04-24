const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getDashboard = async (req, res) => {
    try {

        const [totalProducts, totalCategories, recentProducts] =
            await Promise.all([
                Product.countDocuments(),
                Category.countDocuments(),
                Product.find().sort({ createdAt: -1 }).limit(5)
            ]);

        res.json({
            error: false,
            success: true,
            data: {
                totalProducts,
                totalCategories,
                recentProducts
            }
        });

    } catch (error) {
        res.status(500).json({
            error: true,
            success:false,
            message: error.message
        });
    }
};