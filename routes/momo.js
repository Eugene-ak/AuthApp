const express = require("express");
const { getAccountBalance, getUserBasicInfo } = require("../controllers/momo.controller");

const router = express.Router();

router.get("/accountBalance", getAccountBalance);
router.get("/getUserInfo", getUserBasicInfo)

module.exports = router;