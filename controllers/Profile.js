const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const bcrypt = require("bcrypt");
const { uploadToCloudinary } = require("../utils/uploadFile");

module.exports.updateProfile = async (req, res) => {
  try {
    const { gender, dob, about, phone } = req.body;

    let image = req.files?.image;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user",
      });
    }
    //check if profile already exists , if it does update it else create a new one
    let profile = await Profile.findOne({ user: user._id });

    if (image) {
      var uploadedImage = await uploadToCloudinary(image);
    }
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
        image: uploadedImage?.secure_url || user.image,
      },
      {
        new: true,
      }
    ).populate("additionalDetails");
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
    // console.log(id);
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
    // console.log(user.additionalDetails._id.toString());
    const profileId = user?.additionalDetails?._id;

    if (!profileId) {
      await User.findByIdAndDelete(id);
      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
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

module.exports.getUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .populate("courses");
    // .populate("courseProgress");
    if (userDetails) {
      userDetails.password = undefined;
    }
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

module.exports.changePassword = async (req, res) => {
  try {
    const { password, newPassword, confirmNewPassword } = req.body;
    if (!password || !newPassword || !confirmNewPassword) {
      return res.status(401).json({
        success: false,
        message: "Empty fields found",
      });
    }
    if (newPassword !== confirmNewPassword) {
      return res.status(402).json({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    const existingUser = await User.findById({ _id: req.user.id });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(402).json({
        success: false,
        message: "Password entered is wrong",
      });
    }

    const newHashedPasswod = await bcrypt.hash(newPassword, 12);
    const updatedUser = await User.findByIdAndUpdate(
      existingUser._id,
      {
        password: newHashedPasswod,
      },
      { new: true }
    );

    updatedUser.password = undefined;

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      updatedUser,
    });
  } catch (error) {
    console.error("Error while changing password", error);
    return res.status(500).json({
      success: false,
      message: "Error while changing password",
      error,
    });
  }
};
