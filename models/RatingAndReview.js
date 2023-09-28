const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  rating: {
    type: Number,
  },
  review: {
    type: String,
    trim: true,
  },
});

const RatingAndReview = mongoose.model(
  "RatingAndReview",
  ratingAndReviewSchema
);

module.exports = RatingAndReview;
