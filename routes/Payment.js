const express = require("express");
const router = express.Router();

const { createOrder, verifySignature } = require("../controllers/Payment");
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middleware/auth");

//create order
router.post("/create-order", auth, isStudent, createOrder);

//verify signature
router.post("/verify-signature", verifySignature);
