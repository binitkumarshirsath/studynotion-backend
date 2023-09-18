const mongoose = require("mongoose");

const courseProgessSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

const CourseProgress = mongoose.model("CourseProgress", courseProgessSchema);

module.exports = CourseProgress;
