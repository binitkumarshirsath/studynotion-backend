const User = require("../models/User");
const sendMail = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail-template/courseEnrollment");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const { instance } = require("../config/payment/payment");
/*
    Read this docs for naming functions names
    https://razorpay.com/docs/payments/payments/capture-settings/
    https://razorpay.com/docs/api/orders/
*/

module.exports.createOrder = async (req, res) => {
  try {
    const id = req.user.id;
    const courseId = req.body.courseId;
    if (!id || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid id or course id found",
      });
    }

    const user = await User.findById(id);
    const course = await Course.findById(courseId);
    if (user) {
      user.password = undefined;
    }
    if (!user || !course) {
      return res.status(400).json({
        success: false,
        message: "Invalid course or user found",
        user: user,
        course: course,
      });
    }

    // check if user has already bought the course
    const courseBought = user.courses.includes(
      mongoose.Types.ObjectId(courseId)
    );

    if (courseBought) {
      return res.status(200).json({
        success: false,
        message: "User have already purchased the course. Check dashboard",
      });
    }
    //creating an order
    const orderResponse = await instance.orders.create({
      amount: course.price * 100,
      currency: "INR",
      receipt: `${user.id}`,
      notes: {
        userId: `${user.id}`,
        courseId: `${course.id}`,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Order created successfully",
      orderId: orderResponse.id,
      courseName: course.courseName,
      orderResponse,
    });
  } catch (error) {
    console.error("Error while capturing payment", error);
    return res.status(500).json({
      success: false,
      message: "Error while capturing payment",
      error,
    });
  }
};

/*
  This went bouncer, will complete later 
https://razorpay.com/docs/webhooks/validate-test/#application-running-on-your-staging-environment
*/
module.exports.verifySignature = async (req, res) => {};
