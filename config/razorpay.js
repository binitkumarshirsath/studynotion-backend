const Razorpay = require("razorpay");
const { RAZORPAY_SECRET, RAZORPAY_KEY } = require("./env/env-vars");

exports.instance = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET,
});
