const express = require("express");
const testAttemptRoutes = require("./routes/testAttemptRoutes");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const quizRoutes = require("./routes/quizRoutes");

const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LMS Backend Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/test-attempts", testAttemptRoutes);
app.use("/api/quizzes", quizRoutes);
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    app.listen(PORT, () => {
      console.log(`Server Running On Port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });