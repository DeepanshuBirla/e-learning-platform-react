const express = require("express");
const TestAttempt = require("../models/TestAttempt");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const attempts = await TestAttempt.find()
  .populate("course", "title")
  .populate("student", "name email");

    res.status(200).json({
      success: true,
      attempts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;