import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

export default function CourseLearn() {
  const navigate = useNavigate();
  const { slug } = useParams(); // yahan slug actually courseId hai

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCourseAndLessons = async () => {
    try {
      const token = localStorage.getItem("token");

      const courseRes = await API.get(`/courses/${slug}`);
      setCourse(courseRes.data.course);

      const lessonRes = await API.get(`/lessons/${slug}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log("TOKEN:", token);
console.log("COURSE ID:", slug);
console.log("LESSONS:", lessonRes.data.lessons);

setLessons(lessonRes.data.lessons || []);
    } catch (error) {
      alert(error.response?.data?.message || "Course not found");
      navigate("/student");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseAndLessons();
  }, [slug]);

  const totalLessons = lessons.length || 1;
  const progress = Math.round((completedLessons / totalLessons) * 100);
  const currentLesson = lessons[activeLesson];

  const getVideoUrl = (url) => {
    if (!url) return "https://www.w3schools.com/html/mov_bbb.mp4";

    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1]?.split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url;
  };

  const isYoutubeVideo = (url) => {
    return url?.includes("youtube.com") || url?.includes("youtu.be");
  };

  const markLessonComplete = async () => {
    try {
      const token = localStorage.getItem("token");

      const newCompleted = Math.min(completedLessons + 1, totalLessons);
      const newProgress = Math.round((newCompleted / totalLessons) * 100);

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

  if (lessons.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <button
          onClick={() => navigate("/student")}
          className="mb-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-gray-600 mt-3">
            No lessons added yet for this course.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <button
        onClick={() => navigate("/student")}
        className="mb-4 bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
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
            {isYoutubeVideo(currentLesson?.videoUrl) ? (
              <iframe
                src={getVideoUrl(currentLesson?.videoUrl)}
                title={currentLesson?.title}
                className="w-full h-80"
                allowFullScreen
              ></iframe>
            ) : (
              <video controls className="w-full h-80 object-cover">
                <source src={getVideoUrl(currentLesson?.videoUrl)} />
              </video>
            )}
          </div>

          <div className="bg-gray-50 border rounded p-4">
            <h2 className="text-xl font-semibold">
              Lesson {activeLesson + 1}: {currentLesson?.title}
            </h2>

            <p className="text-gray-600 mt-2">
              Watch this lesson carefully and mark it complete to update your
              progress.
            </p>

            {currentLesson?.notesUrl && (
              <a
                href={currentLesson.notesUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded"
              >
                📄 Open Notes
              </a>
            )}

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
                onClick={() => navigate(`/test/${slug}`)}
                className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded"
              >
                Take Quiz
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold mb-4">Course Lessons</h2>

          {lessons.map((lesson, index) => (
            <div
              key={lesson._id}
              onClick={() => setActiveLesson(index)}
              className={`p-3 border rounded mb-3 cursor-pointer ${
                activeLesson === index
                  ? "bg-blue-100 border-blue-500"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span>
                  Lesson {index + 1}: {lesson.title}
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
              Course completed! Take quiz to unlock certificate.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}