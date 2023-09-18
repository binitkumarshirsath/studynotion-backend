const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    enum: ["male", "female", "other"],
  },
  dateOfBirth: {
    type: String,
  },
  about: {
    type: String,
    trim: true,
  },
  secondaryContactNumber: {
    type: Number,
    trim: true,
  },
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
