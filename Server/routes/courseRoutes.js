const express = require("express");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add Course
router.post("/", protect, async (req, res) => {
  try {
    const course = await Course.create(req.body);

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get All Courses
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();

    res.status(200).json({
      success: true,
      courses
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Get Single Course
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Update Course
router.put("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

// Delete Course
router.delete("/:id", protect, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        message: "Course not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;