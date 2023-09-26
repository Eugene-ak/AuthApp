const express = require("express");
const { getUniqueRefId, createApiUser, confirmApiUser, getApiKey, getAccessToken } = require("../controllers/momoAuth.controller");

const router = express.Router();

router.get("/getReferenceId", getUniqueRefId);
router.post("/createApiUser", createApiUser);
router.get("/confirmApiUser", confirmApiUser);
router.post("/getApiKey", getApiKey);
router.post("/getAccessToken", getAccessToken);

module.exports = router;
