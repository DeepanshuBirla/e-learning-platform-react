const express = require("express");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Add lesson
router.post("/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, videoUrl, notesUrl, order } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const lesson = await Lesson.create({
      course: courseId,
      title,
      videoUrl,
      notesUrl,
      order,
    });

    res.status(201).json({
      success: true,
      message: "Lesson added successfully",
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get lessons by course
router.get("/:courseId", protect, async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    }).sort({ order: 1 });

    res.status(200).json({
      success: true,
      lessons,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete lesson
router.delete("/:lessonId", protect, async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.lessonId);

    res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;