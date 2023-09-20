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
        let { pageNumber = 1, limit = 10 } = req.query;
        const news = await newsModel.find().skip((pageNumber - 1) * limit).limit(limit);
        const totalCount = await newsModel.countDocuments();
        let totalPages = totalCount == 0 ? 1 : Math.ceil(totalCount / limit);

        pageNumber = parseInt(pageNumber);
        limit = parseInt(limit);

        if (pageNumber > totalPages) {

            return res.status(404).json({error: "Page not found"});

        } else {
            const nextPage = (pageNumber + 1) > totalPages ? totalPages : pageNumber + 1;
            const prevPage = (pageNumber - 1) <= 0 ? pageNumber : pageNumber - 1;

            const startIndex = pageNumber == 1 || limit == 1 ? pageNumber : (pageNumber * limit) - 1;
            const endIndex = pageNumber == 1 ? news.length : pageNumber == totalPages ? ((pageNumber - 1) * limit) + news.length : ((pageNumber - 1) * limit) + limit;
            
            res.json({news, totalCount, totalPages, currentPage: parseInt(pageNumber), nextPage, prevPage, startIndex, endIndex});
        }

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