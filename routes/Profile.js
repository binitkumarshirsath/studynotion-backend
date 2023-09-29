const express = require("express");
const router = express.Router();

//import controllers
const {
  getUserDetails,
  changePassword,
  deleteAccount,
  updateProfile,
} = require("../controllers/Profile");

const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

//import middleware
const { auth } = require("../middleware/auth");

//get a single users detail
router.get("/user-details", auth, getUserDetails);

//update the user profile
router.post("/update-user", auth, updateProfile);

//change users password while logged in
router.post("/change-password", auth, changePassword);

//delete account
router.delete("/delete-account", auth, deleteAccount);

/*
####################################################################
#                Reset password while not logged in                #
####################################################################
*/

//generate token and send it to mail
router.post("/password-token", resetPasswordToken);

//use token to reset password
router.post("/reset-password", resetPassword);

module.exports = router;
