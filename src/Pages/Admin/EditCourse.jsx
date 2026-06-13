import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../Components/sidebar";
import CourseForm from "./CourseForm";
import API from "../../services/api";

export default function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${id}`);

      const course = res.data.course;

      setInitialData({
        title: course.title || "",
        slug: course.slug || "",
        duration: course.duration || "",
        totalLessons: course.totalLessons || 0,
        language: course.language || "English",
        shortDescription: course.description || "",
        longDescription: course.longDescription || "",
        instructorName: course.instructor || "",
        instructorRole: course.instructorRole || "",
        instructorExperience: course.instructorExperience || "",
        category: course.category || "",
        thumbnail: course.thumbnail || "",
      });
    } catch (error) {
      alert(error.response?.data?.message || "Course not found");
      navigate("/admin/courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const handleUpdate = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/courses/${id}`,
        {
          title: data.title,
          description: data.shortDescription,
          instructor: data.instructorName,
          category: data.category,
          thumbnail: data.thumbnail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course updated successfully");
      navigate("/admin/courses");
    } catch (error) {
      alert(error.response?.data?.message || "Update course failed");
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-gray-100 min-h-screen w-full">
          Loading course...
        </div>
      </div>
    );
  }

  if (!initialData) return null;

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-xl font-bold mb-4">Edit Course</h1>

        <CourseForm
          initialData={initialData}
          onSubmit={handleUpdate}
          submitText="Update Course"
        />
      </div>
    </div>
  );
}