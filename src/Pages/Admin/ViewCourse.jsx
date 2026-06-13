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

  useEffect(() => {
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

    fetchCourse();
  }, [id, navigate]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);

      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await API.post(
        `/enrollments/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Enrolled successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Enrollment failed");
    } finally {
      setEnrolling(false);
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

        <div className="bg-white rounded shadow p-6">
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
      </div>
    </div>
  );
}