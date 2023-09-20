const mongoose = require("mongoose");

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  courses: [
    {
      type: mongoose.Schema.Types.mongoose,
      ref: "Course",
    },
  ],
});

const Tag = mongoose.model("Tag", tagSchema);

module.exports = Tag;
