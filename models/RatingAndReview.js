const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
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
