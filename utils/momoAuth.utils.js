const axios = require("axios");
const { v4:uuidv4 } = require("uuid");

const uniqueRefId = uuidv4();

const getUuid = async () => {
    try {
        const options = {
            url: "https://www.uuidgenerator.net/api/version4",
            method: "get"
        }
        const result = await axios(options);
        // process.env.UNIQUE_REF_ID = result.data;
        // console.log(result.data);
        return result.data;
    } catch (error) {
        return error.message;
    }
}

const APIUser = async () => {
    try{
        const options = {
            url: "https://sandbox.momodeveloper.mtn.com/v1_0/apiuser",
            method: "post",
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
                "X-Reference-Id": process.env.UNIQUE_REF_ID,
                "Content-Type": "application/json"
            },
            data: {
                providerCallbackHost: `https://webhook.site/${process.env.UNIQUE_REF_ID}`
            }
        }
        const result = await axios(options);
        // console.log(result.data);
        return result.data;
    } catch (error) {
        return error.message;
    }
}

const confirmAPIUser = async () => {
    try{
        const options = {
            url: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${process.env.UNIQUE_REF_ID}`,
            method: "get",
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY
            }
        }
        const result = await axios(options);
        // console.log(result);
        return result.data;
    } catch (error) {
        return error.message;
    }
}

const getAPIKey = async () => {
    try{
        const options = {
            url: `https://sandbox.momodeveloper.mtn.com/v1_0/apiuser/${process.env.UNIQUE_REF_ID}/apikey`,
            method: "post",
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
                "X-Reference-Id": process.env.UNIQUE_REF_ID
            }
        }
        const result = await axios(options);
        // console.log(result);
        // process.env.MOMO_API_KEY = result.data.apiKey;
        return result.data;
    } catch (error) {
        return error.message;
    }
}

const GetAccessToken = async () => {
    try{
        const credentials = Buffer.from(`${process.env.UNIQUE_REF_ID}:${process.env.MOMO_API_KEY}`).toString("base64");
        const options = {
            url: "https://sandbox.momodeveloper.mtn.com/collection/token/",
            method: "post",
            headers: {
                "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
                "X-Reference-Id": process.env.UNIQUE_REF_ID,
                Authorization: `Basic ${credentials}`
            }
        }
        const result = await axios(options);
        // console.log(result);
        return result.data;
    } catch (error) {
        return error.message;
    }
}

module.exports = {
    getUuid,
    APIUser,
    confirmAPIUser,
    getAPIKey,
    GetAccessToken
}