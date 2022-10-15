const User = require("../model/user");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const Email = require("../utils/email");
const crypto = require("crypto");
const cloudinary = require("../utils/cloudinary");

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
        confirmPassword: req.body.confirmPassword,
    });

    //! loading image to cloud
    let image;
    if (req.file) {
        image = await cloudinary.uploader.upload(req.file.path);
    };

    await user.update({
        photo: image.secure_url,
        imgId: image.public_id,
    });
    user.imgId = image.public_id;
    user.photo = image.secure_url;

    const token = signJWT(user._id);

    //!Send Email
    const url = `${req.protocol}://${req.get("host")}`;
    const emailHandler = new Email(user, url);
    await emailHandler.sendWelcome();

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
    const pw = await user.checkPassword(password);

    if (!user || !pw) return next(new GlobalError("Please check email and password", 403));

    //! 4) sign token
    const token = signJWT(user._id);

    res.json({
        success: true,
        token
    });
});

//! Sending Email When Forget Password
exports.forgetPassword = asyncCatch(async (req, res, next) => {
    const {
        email
    } = req.body;

    //! checking if user exist with given email
    const user = await User.findOne({
        email
    });

    if (!user) return next(new GlobalError("User with this email does not exist!", 404));

    //! creating resetToken and adding to the user data
    const resetToken = await user.hashResetPassword();
    await user.save({
        validateBeforeSave: false
    });

    //! sending email
    const urlString = `${req.protocol}://${req.get("host")}/${resetToken}`;
    const emailHandler = new Email(user, urlString);
    await emailHandler.sendResetPassword();

    res.status(200).json({
        success: true,
        message: "Email sent!",
    });
});

//! Changing Password Based On Email That Have Been Sent
exports.resetPassword = asyncCatch(async (req, res, next) => {
    const token = req.params.token;
    const {
        password,
        confirmPassword
    } = req.body;

    //! hassing token for checking
    const hashedToken = crypto
        .createHash("md5")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetToken: hashedToken,
        resetTime: {
            $gt: new Date()
        },
    });

    //! checking if user exist and token is match
    if (!user) return next(new GlobalError("Token wrong or expired!"));

    //! updating user
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.resetToken = undefined;
    user.resetTime = undefined;
    await user.save();

    //! creating new Token for singIn
    const newToken = signJWT(user._id);

    res.json({
        success: true,
        token: newToken
    });
});