const User = require("../model/user");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

//! Creating JWT Token For User
const signJWT = (id) => {
    const token = jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    return token;
};

//! Changing Password When User Signed In
exports.changePassword = asyncCatch(async (req, res, next) => {
    //! checking req.body
    const {
        password,
        confirmPassword
    } = req.body;
    if (!password || !confirmPassword) return next(new GlobalError("Please provide password and confirm password!"));

    //! checking if password correct
    const user = await User.findById(req.user.id);
    const isCurrentPasswordCorrect = await user.checkPassword(req.body.currentPassword);
    if (!isCurrentPasswordCorrect) return next(new GlobalError("Incorrect Password!", 403));

    //! saving user
    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save();

    //! getting token for authenticate the user
    const token = signJWT(user._id);

    res.status(200).json({
        success: true,
        message: "Password updated",
        token
    });
});

//! Changing Password When User Signed In
exports.updateUser = asyncCatch(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email
    }, {
        new: true
    });

    res.status(200).json({
        success: true,
        message: "User updated",
        user
    });
});