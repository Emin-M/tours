const User = require("../model/user");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");

//! Creating JWT Token For User
const signJWT = (id) => {
    const token = jwt.sign({
        id
    }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });

    return token;
};

//! Registering The User
exports.signup = asyncCatch(async (req, res, next) => {
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword
    });
    const token = signJWT(user._id);

    res.status(201).json({
        success: true,
        user,
        token,
    });
});

//! Login The User
exports.login = asyncCatch(async (req, res, next) => {
    //! 1) is email and password exist in request?
    const {
        email,
        password
    } = req.body;

    if (!email || !password) return next(new GlobalError("Please provide email and password", 404));

    //! 2) is person exist with this email?
    const user = await User.findOne({
        email
    });

    //! 3) is password correct?
    const pw = user.checkPassword(password);

    if (!user || !pw) return next(new GlobalError("Please check email and password", 403));

    //! 4) sign token
    const token = signJWT(user._id);

    res.json({
        success: true,
        token
    });
});