const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFile = async (foldername, userId) => {
    try {
        const storage = multer.diskStorage({
            destination: function (req, file, callback) {
                image_path = path.join(__dirname, `../public/images/${foldername}`);
                fs.mkdirSync(image_path, {recursive: true});
                callback(null, image_path);
            },
            filename: function (req, file, callback) {
                let temp_file_array = file.originalname.split(".");
                let oldname = temp_file_array[0];
                if (!userId) {
                    callback(null, file.originalname);
                } else {
                    callback(null, `${userId}.${temp_file_array[1]}`);
                }
            }
        })
        return storage;
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    uploadFile
}