const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  timeDuration: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
});

const SubSection = mongoose.model("SubSection", subSectionSchema);

module.exports = SubSection;
