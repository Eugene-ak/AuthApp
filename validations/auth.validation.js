const joi = require("joi");

const registerValidation = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email(),
    password: joi.string().required().min(8)
});

module.exports = {
    registerValidation
}