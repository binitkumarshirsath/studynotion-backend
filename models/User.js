const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  additionalDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
  accountType: {
    enum: ["student", "admin", "instructor"],
    type: String,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  courseProgess: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    },
  ],
  image: {
    type: String,
  },

  //forget password fields
  token: {
    type: String,
  },

  tokenExpiresIn: {
    type: Date,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
