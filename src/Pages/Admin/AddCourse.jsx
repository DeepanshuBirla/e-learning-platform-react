import Sidebar from "../../Components/sidebar";
import CourseForm from "./CourseForm";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function AddCourse() {
  const navigate = useNavigate();

  const initialData = {
    title: "",
    slug: "",
    duration: "",
    totalLessons: 0,
    language: "English",
    shortDescription: "",
    longDescription: "",
    instructorName: "",
    instructorRole: "",
    instructorExperience: "",
    category: "",
    thumbnail: "",
  };

  const handleAdd = async (data) => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
        "/courses",
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

      alert("Course added successfully");
      navigate("/admin/courses");
    } catch (error) {
      alert(error.response?.data?.message || "Add course failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-6 bg-gray-100 min-h-screen w-full">
        <h1 className="text-xl font-bold mb-4">Add Course</h1>
        <CourseForm
          initialData={initialData}
          onSubmit={handleAdd}
          submitText="Add Course"
        />
      </div>
    </div>
  );
}