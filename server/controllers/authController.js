const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= REGISTER USER =================
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check all fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password from response
        const { password: pwd, ...userData } = user.toObject();

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: userData,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// ================= LOGIN USER =================
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password",
            });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Remove password from response
        const { password: pwd, ...userData } = user.toObject();

        res.status(200).json({
            message: "Login successful",
            token,
            user: userData,
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
// Get Logged-in User Profile
const getProfile = async (req, res) => {
    res.status(200).json(req.user);
};
module.exports = {
    registerUser,
    loginUser,
    getProfile,
};