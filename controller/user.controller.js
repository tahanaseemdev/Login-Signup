const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const { User, TempUser } = require('../models/user.model.js');
const emailSender = require('../services/emailSender.js');


const createUser = async (req, res) => {
    try {
        const user = req.body;
        if (await User.findOne({ "email": user.email })) {
            return res.status(400).json({ message: "Email already exists" });
        }
        user.otp = Math.floor(100000 + Math.random() * 900000);
        user.otpExpirationTime = Date.now() + 2 * 60 * 1000;
        user.password = await bcrypt.hash(user.password, 12);
        emailSender(user.otp, user.email);
        await TempUser.create(user);
        res.status(200).json({ message: "User Created Successfully & OTP sent" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const validateOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await TempUser.findOne({ "email": email });
        try {
            if (user.otpExpirationTime > Date.now()) {
                if (user.otp == otp) {
                    const { firstName, lastName, email, phone, password } = user;
                    await User.create({ firstName, lastName, email, phone, password });
                    await TempUser.deleteOne({ _id: user._id });
                    res.status(200).json({ message: "OTP Verified" });
                } else {
                    res.status(400).json({ message: "Wrong OTP" });
                }
            } else {
                res.status(400).json({ message: "OTP expired" });
            }
        } catch (error) {
            console.log(error.message);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        const newOtp = Math.floor(100000 + Math.random() * 900000);
        const newOtpExpirationTime = Date.now() + 2 * 60 * 1000;
        const user = await TempUser.findOneAndUpdate(
            { "email": email },
            { $set: { otp: newOtp, otpExpirationTime: newOtpExpirationTime } },
            { new: true }
        )
        emailSender(newOtp, email);
        res.status(200).json({ message: "OTP resended" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong email or password" });
        }
        req.session.user = { id: user._id, email: user.email };
        await req.session.save();
        res.status(200).json({ message: "Login Succesful", isAuth: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const checkSession = async (req, res) => {
    try {
        if (req.session.user) {
            res.status(200).json({ isAuth: true });
        } else {
            res.status(401).json({ isAuth: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Logout failed" });
            }
            res.clearCookie('connect.sid');
            res.status(200).json({ message: "Logged out successfully" });
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "User does not exist" });
    }
    user.resetToken = Math.floor(100000 + Math.random() * 900000);
    user.resetTokenExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'EMAIL_ADDRESS',
            pass: 'PASSWORD' // Note that this is not the gmail account password rather the app pass key generated through our account. 
        }
    });
    var mailOptions = {
        from: 'User',
        to: `${email}`,
        subject: 'Forgot Password',
        html: `<h1>Click on the link to reset password <a href="http://localhost:5173/resetPassword?email=${encodeURIComponent(email)}&token=${user.resetToken}">RESET PASSWORD</a></h1>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    res.status(200).json({ message: "Password Reset Link has been sent to your email" });
}

const changePassword = async (req, res) => {
    try {
        const { email, token, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        if (user.resetTokenExpiry > Date.now()) {
            if (user.resetToken == token) {
                user.password = await bcrypt.hash(password, 12);
                user.resetTokenExpiry = null;
                user.resetToken = null;
                await user.save();
                res.status(200).json({ message: "Password Changed" });
            } else {
                res.status(400).json({ message: "Not Authorised" });
            }
        } else {
            res.status(400).json({ message: "Reset Link Expired" });
        }
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    validateOtp,
    resendOtp,
    login,
    checkSession,
    logout,
    forgotPassword,
    changePassword
};