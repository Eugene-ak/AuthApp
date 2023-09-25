const { getUuid, APIUser, confirmAPIUser, getAPIKey, GetAccessToken } = require("../utils/momoAuth.utils");

const getUniqueRefId = async (req, res) => {
    try {
        const uniqueRef = await getUuid();
        res.json({uuid: uniqueRef});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const createApiUser = async (req, res) => {
    try {
        const ApiUser = await APIUser();
        res.status(201).json({message: "User successfully created"});
    } catch(error) {
        return res.status(400).json({error: error.message});
    }
}

const confirmApiUser = async (req, res) => {
    try {
        const ApiUser = await confirmAPIUser();
        res.json(ApiUser);
    } catch(error) {
        return res.status(400).json({error: error.message});
    }
}

const getApiKey = async (req, res) => {
    try {
        const ApiUser = await getAPIKey();
        res.json(ApiUser);
    } catch(error) {
        return res.status(400).json({error: error.message});
    }
}

const getAccessToken = async (req, res) => {
    try {
        const ApiUser = await GetAccessToken();
        res.json(ApiUser);
    } catch(error) {
        return res.status(400).json({error: error.message});
    }
}

module.exports = {
    getUniqueRefId,
    createApiUser,
    confirmApiUser,
    getApiKey,
    getAccessToken
}