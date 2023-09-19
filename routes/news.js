const express = require("express");
const { isAuthenticated } = require("../middlewares/auth.middleware");
const { uploadNews, getAllNews, getNewsById, updateNewsById, deleteNewsById } = require("../controllers/news.controller");

var router = express.Router();

router.post("/uploadNews", isAuthenticated, uploadNews);
router.get("/getAllNews", getAllNews);
router.get("/getNewsById/:id", getNewsById);
router.patch("/updateNewsById/:id", isAuthenticated, updateNewsById);
router.delete("/deleteNewsById/:id", isAuthenticated, deleteNewsById);

module.exports = router;
