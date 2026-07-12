const User = require("../models/User");

// Get Logged-in User Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        res.json({
            message: "Profile fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

// Update Logged-in User Profile
const updateProfile = async (req, res) => {
    try {
        const user = req.user;

        user.name = req.body.name || user.name;
        user.bio = req.body.bio || user.bio;
        user.profilePic = req.body.profilePic || user.profilePic;

        const updatedUser = await user.save();

        res.json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getProfile,
    updateProfile,
};