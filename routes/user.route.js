const express = require('express');
const user = require('../models/user.model.js');
const router = express.Router();
const { createUser, validateOtp, resendOtp, login, checkSession, logout, forgotPassword,changePassword } = require('../controller/user.controller.js');

// Create User
router.post('/',createUser);
router.post('/otp', validateOtp);
router.post('/resendotp', resendOtp);
router.post('/login',login);
router.get('/checkauth',checkSession);
router.post('/logout',logout);
router.post('/forgotpassword',forgotPassword)
router.post('/changepassword',changePassword)

module.exports = router;