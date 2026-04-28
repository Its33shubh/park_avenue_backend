const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 🔥 validate full date 
function parseDOB(dobString) {
    if (!/^\d{8}$/.test(dobString)) return null;

    const day = parseInt(dobString.substring(0, 2));
    const month = parseInt(dobString.substring(2, 4)) - 1;
    const year = parseInt(dobString.substring(4, 8));

    const date = new Date(year, month, day);

    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
}

exports.Register = async (req, res) => {
    try {
        const { name, birthDate } = req.body;

        if (!name || birthDate === undefined) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            });
        }

        const cleanName = name.trim();

        //  number validation
        if (isNaN(birthDate)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Birth date must be a number"
            });
        }

        // convert to string
        const dobString = birthDate.toString();

        //  length check
        if (dobString.length !== 8) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Birth date must be 8 digits (DDMMYYYY)"
            });
        }

        //  parse DOB
        const parsedDate = parseDOB(dobString);

        if (!parsedDate) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid DOB format (DDMMYYYY)"
            });
        }

        //  future date check
        if (parsedDate > new Date()) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Birth date cannot be future"
            });
        }

        const existingUser = await User.findOne({ name: cleanName });
        if (existingUser) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "User already exists"
            });
        }

        //  hash DOB
        const hashedDOB = await bcrypt.hash(dobString, 10);

        const user = await User.create({
            name: cleanName,
            birthDate: hashedDOB
        });

        res.status(201).json({
            error: false,
            success: true,
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name
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


exports.Login = async (req, res) => {
    try {
        const { name, birthDate } = req.body;

        if (!name || birthDate === undefined) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "All fields are required"
            });
        }

        const cleanName = name.trim();

        const user = await User.findOne({ name: cleanName });
        if (!user) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid name"
            });
        }

        // number validation
        if (isNaN(birthDate)) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Birth date must be a number"
            });
        }

        // convert to string
        const dobString = birthDate.toString();

        if (dobString.length !== 8) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid birth date"
            });
        }

        //  compare DOB
        const isMatch = await bcrypt.compare(dobString, user.birthDate);

        if (!isMatch) {
            return res.status(400).json({
                error: true,
                success: false,
                message: "Invalid birth date"
            });
        }

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