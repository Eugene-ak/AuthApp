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

module.exports = {
    uploadNews
}