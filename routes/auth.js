const express = require("express");
const { register, login, forgotPassword, resetPassword } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/forgotPassword", forgotPassword);
router.patch("/resetPassword", resetPassword);

module.exports = router;