const Razorpay = require("razorpay");
const { RAZORPAY_KEY, RAZORPAY_SECRET } = require("../env/env-vars");

module.exports.instance = new Razorpay({
  key_id: RAZORPAY_KEY,
  key_secret: RAZORPAY_SECRET,
});
