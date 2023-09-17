const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { uploadNews } = require("../controllers/news.controller");

var router = express.Router();

router.post("/uploadNews", isAuthenticated, uploadNews);

module.exports = router;