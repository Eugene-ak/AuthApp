const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const hashToken = (token) => {
    return crypto.createHash("sha512").update(token).digest("hex");
}

const genAccessToken = (payload) => {
    return jwt.sign({
        userId: payload._id,
        userEmail: payload.email,
        userRole: payload.role,
        firstName: payload.firstName
    },
    process.env.JWT_ACCESS_SECRET_KEY || "Alternatestring12345", {expiresIn: "3h"});
}

// jti -> json web token id
const genRefreshToken = (payload, jti) => {
    return jwt.sign({
        userId: payload._id,
        userEmail: payload.email,
        userRole: payload.role,
        firstName: payload.firstName,
        jti
    },
    process.env.JWT_REFRESH_SECRET_KEY || "Alternatestring12345", {expiresIn: "6h"});
}

const genTokens = (payload, jti) => {
    const accessToken = genAccessToken(payload);
    const refreshToken = genRefreshToken(payload, jti);

    return { accessToken, refreshToken };
}

const sendMail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            html: text
        })
        .then((res) => {
            if (res) {
                console.log("Success");
            } else {
                console.log(res);
            }
        });
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

module.exports = {
    hashToken,
    genAccessToken,
    genRefreshToken,
    genTokens,
    sendMail
}