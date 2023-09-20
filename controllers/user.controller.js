const multer = require("multer");
const userModel = require("../models/user.model");
const { uploadFile } = require("../utils/fileUpload.utils");
const { updateUserValidation } = require("../validations/user.validation");
const bcrypt = require("bcrypt");

const getAllUsers = async (req, res) => {
    try{
        let { pageNumber = 1, limit = 10 } = req.query;
        pageNumber = parseInt(pageNumber);
        limit = parseInt(limit);

        const users = await userModel.find().skip((pageNumber - 1)).limit(limit);
        const totalCount = await userModel.countDocuments();
        let totalPages = totalCount == 0 ? 1 : Math.ceil(totalCount / limit);

        if (pageNumber > totalPages) {

            return res.status(404).json({error: "Page not found"});

        } else {

            const nextPage = (pageNumber + 1) > totalPages ? false : pageNumber + 1;
            const prevPage = (pageNumber - 1) <= 0 ? false : pageNumber - 1;

            const startIndex = pageNumber == 1 || limit == 1 ? pageNumber : (pageNumber * limit) - 1;
            const endIndex = pageNumber == 1 ? users.length : pageNumber == totalPages ? ((pageNumber - 1) * limit) + users.length : ((pageNumber - 1) * limit) + limit;

            res.json({users, totalCount, totalPages, currentPage: pageNumber, prevPage, nextPage, startIndex, endIndex});

        }

    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const getUserByID = async (req, res) => {
    try{
        // console.log(req.payload);
        const { id } = req.params;
        const user = await userModel.findById(id);
        res.json(user);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const getLoggedInUserDetails = async (req, res) => {
    try{
        // console.log(req.payload);
        const { userId } = req.payload;
        const user = await userModel.findById(userId);
        res.json(user);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const updateUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await updateUserValidation.validateAsync(req.body);
        const user = await userModel.findByIdAndUpdate(id, {$set: {...data}}, {new: true});
        res.json(user);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const updateLoggedInUser = async (req, res) => {
    try {
        // console.log(req.payload);
        const { userId } = req.payload;
        const data = await updateUserValidation.validateAsync(req.body);
        const user = await userModel.findOneAndUpdate({userId}, {$set: {...data}}, {new: true});
        res.json(user);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const changePassword = async (req, res) => {
    try {
        // console.log(req.payload);
        const { userId } = req.payload;
        const { oldPassword, newPassword } = req.body;
        const user = await userModel.findById(userId, {password: 1});
        // console.log(user);
        const match = await bcrypt.compare(oldPassword, user.password);
        if (!match) {
            return res.status(400).json({error: "Old password is wrong"});
        }
        user.password = bcrypt.hashSync(newPassword, 12);
        await user.save();
        delete user.password;
        res.json({message: "Password updated successfully"});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const deleteLoggedInUser = async (req, res) => {
    try {
        const { id } = req.payload;
        const user = await userModel.findOneAndUpdate(id, {$set: {isDeleted: true}});
        res.status(204).json({message: "Successfully deleted"});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const uploadProfileImage = async (req, res) => {
    try {
        const { userId } = req.payload;
        const storage = await uploadFile("profileImages", userId);
        var upload = multer({storage}).single("profilePic");
        upload(req, res, async function (error) {
            if (error) {
                return res.json(error);
            } else {
                const { file } = req;
                const imageUrl = `${process.env.HOST_URL}/public/images/profileImages/${file.filename}`;
                const user = await userModel.findById(userId);
                user.profilePicture.url = imageUrl;
                user.profilePicture.fileName = file.filename;
                await user.save();
                res.json(user)
            }
        })
    } catch (error) {
        return res.status(401).json({error: error.message});
    }
}

module.exports = {
    getAllUsers,
    getUserByID,
    getLoggedInUserDetails,
    updateUserById,
    updateLoggedInUser,
    deleteLoggedInUser,
    changePassword,
    uploadProfileImage
}