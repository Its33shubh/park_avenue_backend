const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//  REGISTER 
exports.Register = async (req, res) => {
    try {
        const { name, birthYear} = req.body;

        if (!name || !birthYear) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            })
        }
        const cleanName = name.trim();

        if (isNaN(birthYear)) {
            return res.status(400).json({
              error: true,
              success:false,
              message: "Birth year must be a number"
            });
          }

          const year = Number(birthYear);
          if (year < 1000 || year > 9999) {
            return res.status(400).json({
              error: true,
              success:false,
              message: "Birth year must be exactly 4 digits"
            });
          }

        const existingUser = await User.findOne({ name: cleanName })
        if (existingUser) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User already exists"
            });
        }

        const hashedYear = await bcrypt.hash(year.toString(), 10);

        //user create
        const user = await User.create({
            name : cleanName,
            birthYear:hashedYear
        });

        res.status(201).json({
            error:false,
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name
            }
        });

    } catch (error) {
        res.status(500).json({
            error:true,
            success: false,
            message: error.message
        });
    }
}

exports.Login = async (req, res) => {
    try {
        const { name, birthYear } = req.body;

        if (!name || !birthYear) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "all filed are require"
            });
        }
        const cleanName = name.trim();

        const user = await User.findOne({ name:cleanName });
        if (!user) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid userName"
            });
        }

        // compare 
        const isMatch = await bcrypt.compare(birthYear.toString(), user.birthYear );
        if (!isMatch) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid birthYear"
            });
        }

        // generate token
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            error: false,
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,  
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            error: true,
            success: false,
            message: error.message
        });
    }
}