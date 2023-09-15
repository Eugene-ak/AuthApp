const joi = require("joi");

const updateUserValidation = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    profilePicture: joi.object({
        url: joi.string(),
        fileName: joi.string()
    })
});

module.exports = {
    updateUserValidation
}