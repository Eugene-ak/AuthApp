const joi = require("joi");

const newsValidation = joi.object({
    heading: joi.string().required(),
    body: joi.string().required(),
    picture: joi.any()
});

module.exports = {
    newsValidation
}