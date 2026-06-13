import { useEffect, useState } from "react";
import Sidebar from "../../Components/sidebar";
import DataTable from "../../Components/DataTable";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/courses");
      setCourses(res.data.courses || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const deleteCourse = async (id) => {
    if (!window.confirm("Delete this course?")) return;

    try {
      const token = localStorage.getItem("token");

      await API.delete(`/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Course deleted successfully");
      fetchCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const columns = [
    {
      key: "title",
      label: "Course",
      render: (course) => (
        <div>
          <p className="font-medium">{course.title}</p>
          <p className="text-xs text-gray-500">{course.description}</p>
        </div>
      ),
    },
    {
      key: "instructor",
      label: "Instructor",
      render: (course) => course.instructor || "N/A",
    },
    {
      key: "category",
      label: "Category",
      render: (course) => course.category || "N/A",
    },
    {
      key: "thumbnail",
      label: "Thumbnail",
      render: (course) =>
        course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-16 h-10 object-cover rounded mx-auto"
          />
        ) : (
          "No Image"
        ),
    },
  ];

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-gray-100 min-h-screen w-full">
          <h1 className="text-xl font-bold">Loading courses...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="p-6 bg-gray-100 min-h-screen w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <h1 className="text-xl font-bold">Manage Courses</h1>

          <button
            onClick={() => navigate("/admin/courses/add")}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
          >
            + Add Course
          </button>
        </div>

        <div className="bg-white rounded shadow">
          <DataTable
            columns={columns}
            data={courses}
            pageSize={6}
            renderActions={(course) => (
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => navigate(`/admin/courses/view/${course._id}`)}
                  className="bg-green-600 text-white px-3 py-1 rounded text-xs"
                >
                  View
                </button>

                <button
                  onClick={() => navigate(`/admin/courses/edit/${course._id}`)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteCourse(course._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}