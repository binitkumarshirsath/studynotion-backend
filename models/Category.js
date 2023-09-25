const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
    unique: true,
    trim: true,
  },
  description: {
    required: true,
    type: String,
    trim: true,
  },
  course: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
