import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/sidebar";
import API from "../../services/api";

export default function ViewCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [savingQuiz, setSavingQuiz] = useState(false);

  const [quiz, setQuiz] = useState({
    passPercentage: 60,
    questions: [
      {
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
      },
    ],
  });

  const [lessons, setLessons] = useState([]);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    videoUrl: "",
    notesUrl: "",
    order: 1,
  });

  useEffect(() => {
    fetchCourse();
    fetchQuiz();
    fetchLessons();
  }, [id]);

  const getTokenHeader = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data.course);
    } catch (error) {
      alert(error.response?.data?.message || "Course not found");
      navigate("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  const fetchQuiz = async () => {
    try {
      const res = await API.get(`/quizzes/${id}`, getTokenHeader());

      if (res.data.quiz) {
        setQuiz({
          passPercentage: res.data.quiz.passPercentage || 60,
          questions:
            res.data.quiz.questions?.length > 0
              ? res.data.quiz.questions.map((q) => ({
                  question: q.question || "",
                  options:
                    q.options?.length === 4 ? q.options : ["", "", "", ""],
                  correctAnswer: q.correctAnswer || 0,
                }))
              : [
                  {
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: 0,
                  },
                ],
        });
      }
    } catch (error) {
      console.log("No quiz found yet");
    }
  };

  const fetchLessons = async () => {
    try {
      const res = await API.get(`/lessons/${id}`, getTokenHeader());
      setLessons(res.data.lessons || []);
    } catch (error) {
      console.log("No lessons found yet");
    }
  };

  const handleEnroll = async () => {
    try {
      setEnrolling(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await API.post(`/enrollments/${id}`, {}, getTokenHeader());

      alert("✅ Enrolled successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const handleQuizChange = (field, value) => {
    setQuiz({
      ...quiz,
      [field]: value,
    });
  };

  const handleQuestionChange = (qIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].question = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleOptionChange = (qIndex, optionIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].options[optionIndex] = value;
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[qIndex].correctAnswer = Number(value);
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: 0,
        },
      ],
    });
  };

  const removeQuestion = (qIndex) => {
    const updatedQuestions = quiz.questions.filter((_, i) => i !== qIndex);

    setQuiz({
      ...quiz,
      questions:
        updatedQuestions.length > 0
          ? updatedQuestions
          : [
              {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
              },
            ],
    });
  };

  const saveQuiz = async () => {
    try {
      setSavingQuiz(true);

      const cleanQuestions = quiz.questions
        .map((q) => ({
          question: q.question.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: Number(q.correctAnswer),
        }))
        .filter(
          (q) =>
            q.question &&
            q.options.length === 4 &&
            q.options.every((opt) => opt !== "")
        );

      if (cleanQuestions.length === 0) {
        alert("Please add at least one valid question");
        return;
      }

      const payload = {
        passPercentage: Number(quiz.passPercentage),
        questions: cleanQuestions,
      };

      try {
        await API.post(`/quizzes/${id}`, payload, getTokenHeader());
        alert("✅ Quiz created successfully");
      } catch (error) {
        if (error.response?.data?.message === "Quiz already exists") {
          await API.put(`/quizzes/${id}`, payload, getTokenHeader());
          alert("✅ Quiz updated successfully");
        } else {
          throw error;
        }
      }

      fetchQuiz();
    } catch (error) {
      alert(error.response?.data?.message || "Quiz save failed");
    } finally {
      setSavingQuiz(false);
    }
  };

  const handleLessonChange = (e) => {
    setLessonForm({
      ...lessonForm,
      [e.target.name]: e.target.value,
    });
  };

  const addLesson = async () => {
    try {
      if (!lessonForm.title || !lessonForm.videoUrl) {
        alert("Lesson title and video URL are required");
        return;
      }

      await API.post(
        `/lessons/${id}`,
        {
          ...lessonForm,
          order: Number(lessonForm.order),
        },
        getTokenHeader()
      );

      alert("✅ Lesson added successfully");

      setLessonForm({
        title: "",
        videoUrl: "",
        notesUrl: "",
        order: lessons.length + 2,
      });

      fetchLessons();
    } catch (error) {
      alert(error.response?.data?.message || "Lesson add failed");
    }
  };

  const deleteLesson = async (lessonId) => {
    try {
      await API.delete(`/lessons/${lessonId}`, getTokenHeader());
      alert("Lesson deleted successfully");
      fetchLessons();
    } catch (error) {
      alert(error.response?.data?.message || "Lesson delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-gray-100 min-h-screen w-full">
          <h1 className="text-xl font-bold">Loading...</h1>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 bg-gray-100 min-h-screen w-full">
        <button
          onClick={() => navigate("/admin/courses")}
          className="bg-gray-700 text-white px-4 py-2 rounded mb-4"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          {course.thumbnail && (
            <img
              src={course.thumbnail}
              alt={course.title}
              className="w-full h-64 object-cover rounded mb-4"
            />
          )}

          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>

          <div className="space-y-3">
            <p>
              <strong>Instructor:</strong> {course.instructor}
            </p>
            <p>
              <strong>Category:</strong> {course.category}
            </p>
            <p>
              <strong>Description:</strong>
            </p>
            <p className="text-gray-700">{course.description}</p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(course.createdAt).toLocaleDateString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(course.updatedAt).toLocaleDateString()}
            </p>
          </div>

          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white px-5 py-2 rounded mt-6"
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-2">Lesson Management</h2>
          <p className="text-gray-500 text-sm mb-5">
            Add video lessons and PDF notes for this course.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              name="title"
              value={lessonForm.title}
              onChange={handleLessonChange}
              placeholder="Lesson Title"
              className="border px-3 py-2 rounded"
            />

            <input
              name="order"
              type="number"
              value={lessonForm.order}
              onChange={handleLessonChange}
              placeholder="Order"
              className="border px-3 py-2 rounded"
            />

            <input
              name="videoUrl"
              value={lessonForm.videoUrl}
              onChange={handleLessonChange}
              placeholder="Video URL"
              className="border px-3 py-2 rounded md:col-span-2"
            />

            <input
              name="notesUrl"
              value={lessonForm.notesUrl}
              onChange={handleLessonChange}
              placeholder="PDF Notes URL"
              className="border px-3 py-2 rounded md:col-span-2"
            />
          </div>

          <button
            onClick={addLesson}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
          >
            + Add Lesson
          </button>

          <div className="mt-6">
            <h3 className="font-bold mb-3">Existing Lessons</h3>

            {lessons.length === 0 ? (
              <p className="text-gray-500">No lessons added yet.</p>
            ) : (
              <div className="space-y-3">
                {lessons.map((lesson) => (
                  <div
                    key={lesson._id}
                    className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <p className="font-semibold">
                        {lesson.order}. {lesson.title}
                      </p>
                      <p className="text-sm text-gray-500 break-all">
                        Video: {lesson.videoUrl}
                      </p>
                      {lesson.notesUrl && (
                        <p className="text-sm text-gray-500 break-all">
                          Notes: {lesson.notesUrl}
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => deleteLesson(lesson._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-5">
            <div>
              <h2 className="text-2xl font-bold">Quiz Management</h2>
              <p className="text-gray-500 text-sm">
                Add or update quiz questions for this course.
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600 mr-2">
                Pass Percentage
              </label>
              <input
                type="number"
                value={quiz.passPercentage}
                onChange={(e) =>
                  handleQuizChange("passPercentage", e.target.value)
                }
                className="border px-3 py-2 rounded w-24"
              />
            </div>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((q, qIndex) => (
              <div
                key={qIndex}
                className="border rounded-xl p-5 bg-gray-50 shadow-sm"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold">Question {qIndex + 1}</h3>

                  <button
                    onClick={() => removeQuestion(qIndex)}
                    className="text-red-600 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <input
                  value={q.question}
                  onChange={(e) =>
                    handleQuestionChange(qIndex, e.target.value)
                  }
                  placeholder="Enter question"
                  className="w-full border px-3 py-2 rounded mb-4"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {q.options.map((opt, optionIndex) => (
                    <input
                      key={optionIndex}
                      value={opt}
                      onChange={(e) =>
                        handleOptionChange(
                          qIndex,
                          optionIndex,
                          e.target.value
                        )
                      }
                      placeholder={`Option ${optionIndex + 1}`}
                      className="border px-3 py-2 rounded"
                    />
                  ))}
                </div>

                <div className="mt-4">
                  <label className="text-sm text-gray-600 mr-2">
                    Correct Answer
                  </label>

                  <select
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleCorrectAnswerChange(qIndex, e.target.value)
                    }
                    className="border px-3 py-2 rounded"
                  >
                    <option value={0}>Option 1</option>
                    <option value={1}>Option 2</option>
                    <option value={2}>Option 3</option>
                    <option value={3}>Option 4</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-3 mt-6">
            <button
              onClick={addQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded"
            >
              + Add Question
            </button>

            <button
              onClick={saveQuiz}
              disabled={savingQuiz}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-5 py-2 rounded"
            >
              {savingQuiz ? "Saving..." : "Save Quiz"}
            </button>

            <button
              onClick={() => navigate(`/test/${id}`)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded"
            >
              Preview Quiz
            </button>

            <button
              onClick={() => navigate(`/learn/${id}`)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded"
            >
              Preview Lessons
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}