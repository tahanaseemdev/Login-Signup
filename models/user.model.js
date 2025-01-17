const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        resetToken: {
            type: String,
            default: null 
        },
        resetTokenExpiry: {
            type: Date,
            default: null 
        }
    },
    {
        timestamps: true
    }
);

const TempUserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        otp: {
            type: Number,
            required: true
        },
        otpExpirationTime: {
            type: Number,
            required: true
        }, 
        createdAt: { 
            type: Date,
            default: Date.now,
            expires: 3600 
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("users", UserSchema);
const TempUser = mongoose.model("unverified_users", TempUserSchema);

module.exports = { User, TempUser };