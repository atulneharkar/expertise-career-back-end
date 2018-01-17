const nodemailer = require("nodemailer");

/*
    Here we are configuring our SMTP Server details.
    STMP is mail server which is responsible for sending and recieving email.
*/
const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    port: 443,
    host: "smtp.gmail.com",
    auth: {
        user: "info.skillunfold@gmail.com",
        pass: "Skun@2018"
    }
});

export default smtpTransport;