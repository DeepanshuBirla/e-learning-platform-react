import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function CourseLearn() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  const lessons = [
    "Introduction",
    "Course Basics",
    "Practical Example",
    "Final Revision",
  ];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await API.get(`/courses/${slug}`);
        setCourse(res.data.course);
      } catch (error) {
        alert(error.response?.data?.message || "Course not found");
        navigate("/student");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug, navigate]);

  const progress = Math.round((completedLessons / lessons.length) * 100);

  const markLessonComplete = async () => {
    try {
      const token = localStorage.getItem("token");

      const newCompleted = Math.min(completedLessons + 1, lessons.length);
      const newProgress = Math.round((newCompleted / lessons.length) * 100);

      await API.put(
        `/enrollments/progress/${slug}`,
        { progress: newProgress },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompletedLessons(newCompleted);

      if (activeLesson < lessons.length - 1) {
        setActiveLesson(activeLesson + 1);
      }

      alert(`Progress Updated: ${newProgress}%`);
    } catch (error) {
      alert(error.response?.data?.message || "Progress update failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="bg-white shadow rounded p-6">Loading course...</div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/student")}
        className="mb-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded shadow p-5">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold">{course.title}</h1>
              <p className="text-gray-600 mt-2">{course.description}</p>

              <div className="flex flex-wrap gap-3 mt-3">
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm">
                  {lessons.length} Lessons
                </span>

                <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                  Progress {progress}%
                </span>

                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded text-sm">
                  Instructor: {course.instructor}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-black rounded overflow-hidden mb-4">
            <video controls className="w-full h-80 object-cover">
              <source
                src="https://www.w3schools.com/html/mov_bbb.mp4"
                type="video/mp4"
              />
            </video>
          </div>

          <div className="bg-gray-50 border rounded p-4">
            <h2 className="text-xl font-semibold">
              Lesson {activeLesson + 1}: {lessons[activeLesson]}
            </h2>

            <p className="text-gray-600 mt-2">
              Watch this lesson carefully and mark it complete to update your
              progress.
            </p>

            <div className="mt-5">
              <div className="flex justify-between text-sm mb-1">
                <span>Course Progress</span>
                <span>{progress}%</span>
              </div>

              <div className="w-full h-3 bg-gray-200 rounded">
                <div
                  className="h-3 bg-blue-600 rounded transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {progress < 100 ? (
              <button
                onClick={markLessonComplete}
                className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded"
              >
                Mark Lesson Complete
              </button>
            ) : (
              <button
                onClick={() => navigate("/student")}
                className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded"
              >
                Get Certificate
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded shadow p-5">
          <h2 className="text-xl font-bold mb-4">Course Lessons</h2>

          {lessons.map((lesson, index) => (
            <div
              key={index}
              onClick={() => setActiveLesson(index)}
              className={`p-3 border rounded mb-3 cursor-pointer ${
                activeLesson === index
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>
                  Lesson {index + 1}: {lesson}
                </span>

                <span>
                  {index < completedLessons
                    ? "✅"
                    : index === activeLesson
                    ? "▶️"
                    : "🔒"}
                </span>
              </div>
            </div>
          ))}

          {progress === 100 && (
            <div className="mt-4 bg-green-100 text-green-700 p-3 rounded">
              Course completed! Certificate unlocked.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}