const nodemailer = require("nodemailer");

const emailSender = (otp, email) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'EMAIL_ADDRESS',
            pass: 'PASSWORD' // Note that this is not the gmail account password rather the app pass key generated through our account. 
        }
    });
    var mailOptions = {
        from: 'Website',
        to: `${email}`,
        subject: 'Verify Your Account',
        html: `<h1>Welcome <br> Your otp is ${otp}</h1>`
    };
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = emailSender;