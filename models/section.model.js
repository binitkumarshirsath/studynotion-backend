const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  sectionName: {
    type: String,
  },
  subSection: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

const SectionSchema = mongoose.model("SectionSchema", sectionSchema);

module.exports = SectionSchema;
