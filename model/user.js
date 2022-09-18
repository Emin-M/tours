const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

//! Tour schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name!"],
    },

    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: true,
        validate: validator.isEmail,
    },

    role: {
        type: String,
        enum: ["user", "admin", "guide"],
        default: "user"
    },

    photo: String,

    password: {
        type: String,
        required: [true, "Please provide a password!"],
    },

    confirmPassword: {
        type: String,
        required: [true, "Please provide a confirm password!"],
        validate: {
            validator: function (el) {
                return el === this.password;
            },
            message: "Passwords are not the same",
        },
    },

    resetToken: String,
    resetTime: Date,
});

userSchema.pre("save", async function (next) {
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
    next();
});

userSchema.methods.checkPassword = async function (originalPassword) {
    return await bcrypt.compare(originalPassword, this.password);
};

userSchema.methods.hashResetPassword = async function () {
    const resetPassword = crypto.randomBytes(12).toString("hex");

    const hashedPassword = crypto
        .createHash("md5")
        .update(resetPassword)
        .digest("hex");

    this.resetToken = hashedPassword;
    this.resetTime = Date.now() + 15 * 60 * 1000;

    return resetPassword;
};

const User = mongoose.model("user", userSchema);

module.exports = User;