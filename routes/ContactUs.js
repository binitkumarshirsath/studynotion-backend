const router = require("express").Router();

const { contactUs } = require("../controllers/ContactUs");
const { auth } = require("../middleware/auth");
//contact us form

router.post("/contact-us", contactUs);
