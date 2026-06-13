const express = require("express");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get my enrolled courses
router.get("/my-courses", protect, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      user: req.user._id,
    }).populate("course");

    res.status(200).json({
      success: true,
      enrollments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update course progress
router.put("/progress/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { progress } = req.body;

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    enrollment.progress = Number(progress);

    if (Number(progress) >= 100) {
      enrollment.completed = true;
    } else {
      enrollment.completed = false;
    }

    await enrollment.save();

    res.status(200).json({
      success: true,
      message: "Progress updated",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Certificate data
router.get("/certificate/:courseId", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: req.params.courseId,
    }).populate("course");

    if (!enrollment) {
      return res.status(404).json({
        message: "Enrollment not found",
      });
    }

    if (!enrollment.completed) {
      return res.status(400).json({
        message: "Complete course first",
      });
    }

    res.status(200).json({
      success: true,
      certificate: {
        student: req.user.name,
        course: enrollment.course.title,
        issuedDate: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Enroll in course
router.post("/:courseId", protect, async (req, res) => {
  try {
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: courseId,
      progress: 0,
      completed: false,
    });

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;