const multer = require("multer");
const newsModel = require("../models/news.model");
const { uploadFile } = require("../utils/fileUpload.utils");
const { newsValidation } = require("../validations/news.validation");


const uploadNews = async (req, res) => {
    try {
        const { userId } = req.payload;
        const storage = await uploadFile("newsImages");
        var upload = multer({storage}).single("picture");
        upload(req, res, async function (error) {
            if (error) {
                return res.json(error);
            } else {
                const data = await newsValidation.validateAsync(req.body);
                let news = new newsModel(data);
                const { file } = req;
                if (file) {
                    news.picture = `${process.env.HOST_URL}/public/images/newsImages/${file.filename}`;
                }
                news.addedBy = userId;
                await news.save();
                res.json(news);
            }
        })
    } catch (error) {
        return res.status(401).json({error: error.message});
    }
}

const getAllNews = async (req, res) => {
    try {
        const news = await newsModel.find();
        res.json(news);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params);
        const news = await newsModel.findById(id);
        res.json(news);
    } catch (error) {
        return res.status(401).json({error: error.message});
    }
}

const updateNewsById = async (req, res) => {
    try {

        const { id } = req.params;
        const data = await newsValidation.validateAsync(req.body);
        const news = await newsModel.findByIdAndUpdate({_id: id}, {$set: {...data}}, {new: true});
        res.json(news);

    } catch (error) {
        return res.status(401).json({error: error.message});
    }
}

const deleteNewsById = async (req, res) => {
    try {
        const { _id } = req.params;
        const news = await newsModel.deleteOne(_id);
        res.status(204).json({message: "Deleted successfully"});
    } catch (error) {
        return res.status(401).json({error: error.message});
    }
}

module.exports = {
    uploadNews,
    getAllNews,
    getNewsById,
    updateNewsById,
    deleteNewsById
}