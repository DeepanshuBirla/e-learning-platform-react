const express = require("express");
const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const protect = require("../middleware/authMiddleware");

const router = express.Router();
const TestAttempt = require("../models/TestAttempt");

// Create Quiz
router.post("/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { passPercentage, questions } = req.body;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    const existingQuiz = await Quiz.findOne({
      course: courseId,
    });

    if (existingQuiz) {
      return res.status(400).json({
        message: "Quiz already exists",
      });
    }

    const quiz = await Quiz.create({
      course: courseId,
      passPercentage: passPercentage || 60,
      questions,
    });

    res.status(201).json({
      success: true,
      quiz,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// Get Quiz
router.get("/:courseId", protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      course: req.params.courseId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Submit Quiz



router.post("/submit/:courseId", protect, async (req, res) => {
  try {
    const { answers } = req.body;

    const quiz = await Quiz.findOne({
      course: req.params.courseId,
    });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    let score = 0;

    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        score++;
      }
    });

    const percentage = Math.round(
      (score / quiz.questions.length) * 100
    );

    const passed = percentage >= quiz.passPercentage;

    
    const attempt = await TestAttempt.create({
  student: req.user._id,
  course: req.params.courseId,
  score,
  total: quiz.questions.length,
  percentage,
  passed,
});

console.log("ATTEMPT SAVED:", attempt);
    res.status(200).json({
      success: true,
      score,
      total: quiz.questions.length,
      percentage,
      passed,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// Update Quiz
router.put("/:courseId", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { passPercentage, questions } = req.body;

    const quiz = await Quiz.findOne({ course: courseId });

    if (!quiz) {
      return res.status(404).json({
        message: "Quiz not found",
      });
    }

    quiz.passPercentage = passPercentage || quiz.passPercentage;
    quiz.questions = questions || quiz.questions;

    await quiz.save();

    res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      quiz,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;