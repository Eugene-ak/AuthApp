const express = require("express");
const { register, login, forgotPassword, resetPassword, revokeToken } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);
router.patch("/genAccessFromRefresh", resetPassword);

module.exports = router;