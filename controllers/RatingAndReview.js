const RatingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");
const Course = require("../models/Course");

module.exports.createRatingAndReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const courseId = req.body.courseId;
    const rating = req.body.rating;
    const review = req.body.review;
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Invalid user or course id",
      });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(400).json({
        success: false,
        message:
          "User/Course doesnt exist with given id, Couldnt post the Rating&Review",
      });
    }

    // check if user is enrolled in the course
    // const isEnrolled = await course.studentEnrolled.find(
    //   mongoose.Types.ObjectId(userId)
    // );
    // const isEnrolled = await Course.findOne({
    //   _id: courseId,
    //   studentEnrolled: {
    //     $elemMatch: {
    //       $eq: userId,
    //     },
    //   },
    // });
    const isEnrolled = course.studentEnrolled.includes(
      new mongoose.Types.ObjectId(userId)
    );
    if (!isEnrolled) {
      return res.status(404).json({
        success: false,
        message: "Student isnt enrolled in the course.",
      });
    }

    const ratingAndReview = await RatingAndReview.create({
      rating,
      review,
    });

    const alreadyReviewed = await RatingAndReview.find({
      course: courseId,
      user: userId,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: "Course is already reviewed by user.",
      });
    }

    await course.ratingAndReviews.push(ratingAndReview.id);

    await course.save();
    return res.status(200).json({
      success: true,
      message: "Successfully added review and rating to course",
      course,
    });
  } catch (error) {
    console.error("Error while posting R&R", error);
    return res.status(500).json({
      success: false,
      messsage: "Error while posting Rating/Review",
      error,
    });
  }
};

module.exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId;
    if (!courseId) {
      return res.status(404).json({
        success: false,
        message: "Invalid course id",
      });
    }

    //aggregate learn

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: "$rating",
          },
        },
      },
    ]);

    let averageRating = 0;

    if (result.length > 0) {
      averageRating = result[0].averageRating;
    }

    res.json({
      success: true,
      message: "Average rating fetched successfully",
      averageRating,
    });
  } catch (error) {
    console.error("Error while fetching average rating", error);
    return res.status(500).json({
      success: false,
      message: `Error while fetching the average rating of course with courseId: ${req.body.courseId}`,
      error,
    });
  }
};

module.exports.getAllRating = async (req, res) => {
  try {
    const ratingAndReviews = await RatingAndReview.find({})
      .sort({
        rating: "desc",
      })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "couseName couseDescription price",
      })
      .exec();

    if (!ratingAndReviews) {
      return res.status(404).json({
        success: false,
        message: "Rating and reviews not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Rating and reviews fetched successfully.",
      ratingAndReviews,
    });
  } catch (error) {
    console.error("Error while retrieving rating and reviews", error);
    return res.status(500).json({
      success: false,
      message: "Error while retrieving all rating and reviews",
      error,
    });
  }
};
