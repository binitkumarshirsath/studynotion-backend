const express = require("express");
const router = express.Router();
/*
Import all the controllers used in making a course 
*/

const {
  createCourse,
  getAllcourses,
  getCourseDetails,
} = require("../controllers/Course");

const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/SubSection");

const {
  createCategory,
  getAllCategory,
  getCategoryPageDetails,
} = require("../controllers/Category");

// import middleware
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middleware/auth");

/*###########################
# Instructor only          #
# Course controllers       #
###########################*/

//create course
router.post("/create-course", auth, isInstructor, createCourse);

//get all courses
router.get("/course-list", getAllcourses);

// get single course details
router.get("/course-details", getCourseDetails);

/*###########################
# Instructor only          #
# Section controllers      #
###########################*/

//create section
router.post("/create-section", auth, isInstructor, createSection);

//update section
router.put("/update-section", auth, isInstructor, updateSection);

//delete section
router.delete("/delete-section", auth, isInstructor, deleteSection);

/*###########################
# Instructor only          #
#SubSection controllers    #
###########################*/

//create subsection
router.post("/create-subsection", auth, isInstructor, createSubSection);

//update subsection
router.put("/update-subsection", auth, isInstructor, updateSubSection);

//delete subsection
router.delete("/delete-subsection", auth, isInstructor, deleteSubSection);

/*###########################
# This is admin only        #
# Category controllers      #
###########################*/

//create category
router.post("/create-category", auth, isAdmin, createCategory);

//get all category
router.get("/all-categories", getAllCategory);

// category page details
router.get("/category-page-details", getCategoryPageDetails);

module.exports = router;
