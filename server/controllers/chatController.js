const User = require("../models/User");

// Get all users except the logged-in user
const getUsers = async (req, res) => {
    try {
        const users = await User.find(
            { _id: { $ne: req.user._id } },
            "-password"
        );

        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    getUsers,
};