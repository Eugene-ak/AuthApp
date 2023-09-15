var express = require('express');
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');
const { getAllUsers, getUserByID, getLoggedInUserDetails, deleteLoggedInUser, updateLoggedInUser, updateUserById, changePassword, uploadProfileImage } = require('../controllers/user.controller');
var router = express.Router();

/* GET users listing. */
router.get('/', isAuthenticated, isAdmin, getAllUsers);
router.get("/:id", isAuthenticated, isAdmin, getUserByID);
router.get("/my/profile", isAuthenticated, getLoggedInUserDetails);
router.patch("/:id", isAuthenticated, isAdmin, updateUserById);
router.patch("/my/update", isAuthenticated, updateLoggedInUser);
router.delete("/my/delete", isAuthenticated, deleteLoggedInUser);
router.patch("/my/changePassword", isAuthenticated, changePassword);
router.patch("/my/uploadProfileImage", isAuthenticated, uploadProfileImage);

module.exports = router;
