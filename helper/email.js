const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const config = require("../config");
const logger = require("./logger");

const CLIENT_ID = config.mail.gmail.client_id;
const CLIENT_SECRET = config.mail.gmail.client_secret;
const REDIRTCT_URI = config.mail.gmail.redirct_uri;
const REFRESH_TOKEN = config.mail.gmail.refresh_token;

const oAuthClient = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRTCT_URI
);
oAuthClient.setCredentials({ refresh_token: REFRESH_TOKEN });

//--------------------------------Middleware--------------------------------

module.exports.sendMail = async function sendMail(email, title, message) {
    let result;
    try {
        const accessToken = await oAuthClient.getAccessToken();
        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "jatinpassi111@gmail.com",
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        const mailOptions = {
            from: "jatinpassi111@gmail.com",
            to: email,
            subject: title,
            text: message,
            html: message,
        };
        logger.error("mail successfully sent");

        result = await transport.sendMail(mailOptions);
        next(null);
    } catch (error) {
        logger.error("mailing error", error);
    }
};
