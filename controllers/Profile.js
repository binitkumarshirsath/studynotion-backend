const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");

module.exports.updateProfile = async (req, res) => {
  try {
    const { gender, dob, about, phone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    //check if profile already exists , if it does update it else create a new one
    let profile = await Profile.findOne({ user: user._id });

    if (!profile) {
      // If a profile doesn't exist, create a new one
      profile = new Profile({
        gender,
        dateOfBirth: dob,
        about,
        contactNumber: phone,
      });
    } else {
      // If a profile exists, update it
      profile.gender = gender;
      profile.dateOfBirth = dob;
      profile.about = about;
      profile.contactNumber = phone;
    }
    await profile.save();
    const updatedUser = await User.findByIdAndUpdate(
      {
        _id: user._id,
      },
      {
        additionalDetails: profile._id,
      },
      {
        new: true,
      }
    );
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error while updating profile", error);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error,
    });
  }
};

module.exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    //deleting the users entry frome enrolled courses
    user.courses.map(async (courseId) => {
      try {
        const course = await Course.findById(courseId);
        course.studentEnrolled.filter(async (studentId) => {
          return studentId.toString() !== id.toString();
        });
        await course.save();
      } catch (error) {
        console.error(
          "Error while deleting the user entry from courses",
          error
        );
        return res.status(500).json({
          success: false,
          message:
            "Error while deleting user entry from courses. Account deleted failed",
          error,
        });
      }
    });

    const profileId = user.additionalDetails._id;
    if (!profileId) {
      await User.findByIdAndDelete(id);
    }
    const deletedProfile = await Profile.findByIdAndDelete(profileId);

    const deletedUser = await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.error("Error while deleting account", error);
    return res.status(500).json({
      success: false,
      message: "Error while deleting account",
      error,
    });
  }
};

module.exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id).populate("additionalDetails");
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      userDetails,
    });
  } catch (error) {
    console.error("Error while fetching user details", error);
    return res.status(500).json({
      success: false,
      message: "Error while fetching user details",
      error,
    });
  }
};
