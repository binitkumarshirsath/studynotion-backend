const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
  },
  timeDuration: {
    type: String,
  },
  description: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
  },
  additionalUrl: {
    type: String,
  },
});

const SubSection = mongoose.model("SubSection", subSectionSchema);

module.exports = SubSection;
