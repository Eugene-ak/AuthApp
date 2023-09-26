const axios = require("axios");
const { GetAccessToken } = require("../utils/momoAuth.utils");

const getAccountBalance = async (req, res) => {
    try {
        const credentials = await GetAccessToken();
        // console.log(credentials);
        const options = {
            url: "https://sandbox.momodeveloper.mtn.com/collection/v1_0/account/balance",
            method: "get",
            headers: {
                Authorization: `Bearer ${credentials.access_token}`,
                "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
                "X-Target-Environment": "sandbox"
            }
        }

        const result = await axios(options);
        // console.log("eeeeee", result.data);
        res.json(result.data);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

const getUserBasicInfo = async (req, res) => {
    try {
        const credentials = await GetAccessToken();
        // console.log(credentials.access_token);
        const options = {
            url: "https://sandbox.momodeveloper.mtn.com/collection/v1_0/accountholder/msisdn/0542917431/basicuserinfo",
            method: "get",
            headers: {
                Authorization: `Bearer ${credentials.access_token}`,
                "Ocp-Apim-Subscription-Key": process.env.OCP_APIM_SUBSCRIPTION_KEY,
                "X-Target-Environment": "sandbox",
                "Cache-Control": "no-cache"
            }
        }

        const result = await axios(options);
        // console.log(result.data);
        res.json(result.data);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
}

module.exports = {
    getAccountBalance,
    getUserBasicInfo
}