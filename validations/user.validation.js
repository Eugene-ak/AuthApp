const joi = require("joi");

const updateUserValidation = joi.object({
    firstName: joi.string(),
    lastName: joi.string()
});

module.exports = {
    updateUserValidation
}