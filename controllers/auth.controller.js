const userModel = require("../models/user.model");
const { registerValidation } = require("../validations/auth.validation");
const bcrypt = require("bcrypt");
const { v4:uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const tokenModel = require("../models/token.model");
const { genTokens, genRefreshToken, hashToken, sendMail } = require("../utils/auth.utils");

const register = async (req, res) => {
    try {
        const data = await registerValidation.validateAsync(req.body);
        let foundUser = await userModel.findOne({email: data.email});
        if (foundUser) {
            if (foundUser.isDeleted == true) {
                foundUser.isDeleted = false;
            }
            else {
                return res.status(409).json({error: "User already exists"});
            }
        }
        else {
            foundUser = new userModel(data);
            foundUser.password = bcrypt.hashSync(data.password, 12);
        }

        await foundUser.save();
        const jti = uuidv4();
        const refreshToken = genRefreshToken(foundUser, jti);
        const tokenData = {
            userId: foundUser._id,
            token: hashToken(refreshToken)
        }
        const token = new tokenModel(tokenData);
        await token.save();
        res.status(201).json(foundUser);

    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const login = async (req, res) => {
    try {
        // console.log(req.headers);
        const { email, password } = req.body;
        const foundUser = await userModel.findOne({email}).select("+password").lean();
        if (!foundUser || foundUser.isDeleted == true) {
            return res.status(404).json({error: "User not found"});
        }
        const match = await bcrypt.compare(password, foundUser.password);
        if (!match) {
            return res.status(401).json({error: "Invalid password"});
        }

        const jti = uuidv4();
        const { accessToken, refreshToken} = genTokens(foundUser, jti);
        console.log(foundUser);
        const tokenData = {
            userId: foundUser._id,
            token: hashToken(refreshToken)
        }
        const token = new tokenModel(tokenData);
        await token.save();
        delete foundUser.password;
        res.json({accessToken, refreshToken, foundUser});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const foundUser = await userModel.findOne({email});
        if (!foundUser) {
            return res.status(400).json({error: "Could not find user"});
        }
        const jti = uuidv4();
        const { accessToken, refreshToken} = genTokens(foundUser, jti);
        const tokenData = {
            userId: foundUser._id,
            token: hashToken(refreshToken),
            jti: jti
        }
        const token = new tokenModel(tokenData);
        await token.save();
        const text = `<h4>Hello ${foundUser.firstName}. You requested for reset password. Click on the link below to reset your password. <a href=http://localhost:3000/api/auth/resetPassword?${refreshToken}>Reset Password Link</a></h4>`;
        sendMail(email, "Password Reset", text);
        res.json({message: `Email sent to ${foundUser.email}`});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        if (!token) {
            return res.status(404).json({error: "Missing token"});
        }
        const payload = jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
        const jti = payload.jti;
        // console.log(jti);
        const savedToken = await tokenModel.findOne({jti});
        // console.log(savedToken);
        if (!savedToken || savedToken.revoked == true) {
            return res.status(401).json({error: "Invalid token"});
        }
        const hashedToken = hashToken(token);
        // console.log(hashedToken);
        console.log(savedToken.token);
        if (hashedToken !== savedToken.token) {
            return res.status(401).json({error: "Unauthorised"});
        }
        const { userId } = savedToken;
        const foundUser = await userModel.findById(userId);
        if (!foundUser) {
            return res.status(404).json({error: "User does not exist"});
        }
        foundUser.password = bcrypt.hashSync(password, 12);
        await foundUser.save();
        await savedToken.updateOne({revoked: true});
        res.json({message: "Password reset successfully"});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
}