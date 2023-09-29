const express = require("express");
const router = express.Router();

const { sendOTP, login, signup } = require("../controllers/Auth");

//send otp before signup
router.post("./send-otp", sendOTP);

//signup with otp
router.post("./sign-up", signup);

//login with email pass
router.post("/login", login);

module.exports = router;
