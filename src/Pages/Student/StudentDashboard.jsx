import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/sidebar";
import Card from "../../Components/Card";
import API from "../../services/api";
import jsPDF from "jspdf";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMyCourses = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/enrollments/my-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEnrollments(res.data.enrollments || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load enrolled courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const completeCourse = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      await API.put(
        `/enrollments/progress/${courseId}`,
        { progress: 100 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Course completed successfully");
      fetchMyCourses();
    } catch (error) {
      alert(error.response?.data?.message || "Progress update failed");
    }
  };

  const getCertificate = async (courseId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get(`/enrollments/certificate/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const cert = res.data.certificate;

      const doc = new jsPDF("landscape");

      doc.setDrawColor(0, 51, 153);
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);

      doc.setFillColor(0, 51, 153);
      doc.rect(10, 10, 277, 25, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("eLearn LMS", 120, 27);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(30);
      doc.text("CERTIFICATE OF COMPLETION", 60, 55);

      doc.setFontSize(16);
      doc.text("This Certificate is Proudly Presented To", 85, 75);

      doc.setTextColor(0, 51, 153);
      doc.setFontSize(32);
      doc.text(cert.student, 100, 100);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text("For Successfully Completing The Course", 80, 120);

      doc.setTextColor(255, 102, 0);
      doc.setFontSize(24);
      doc.text(cert.course, 95, 140);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text(
        `Issued On: ${new Date(cert.issuedDate).toLocaleDateString()}`,
        20,
        180
      );

      doc.line(220, 170, 270, 170);
      doc.text("Authorized Signature", 220, 178);

      doc.setFontSize(12);
      doc.text("www.elearn.com", 130, 190);

      doc.save(`${cert.course}-certificate.pdf`);
    } catch (error) {
      alert(error.response?.data?.message || "Certificate failed");
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Courses Enrolled" value={enrollments.length} />

          <Card
            title="Overall Progress"
            value={
              enrollments.length
                ? Math.round(
                    enrollments.reduce(
                      (sum, item) => sum + (item.progress || 0),
                      0
                    ) / enrollments.length
                  ) + "%"
                : "0%"
            }
          />

          <Card
            title="Certificates Earned"
            value={enrollments.filter((item) => item.completed).length}
          />
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                My Enrolled Courses
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                Continue learning and download your certificates.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="bg-white shadow p-5 rounded">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white shadow p-5 rounded">
              No enrolled courses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {enrollments.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 pb-4"
                >
                  <div className="relative">
                    <img
                      src={
                        item.course?.title?.toLowerCase().includes("react")
                          ? "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80"
                          : item.course?.title
                              ?.toLowerCase()
                              .includes("frontend")
                          ? "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80"
                          : item.course?.category
                              ?.toLowerCase()
                              .includes("backend")
                          ? "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80"
                          : "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
                      }
                      alt={item.course?.title || "Course"}
                      className="w-full h-44 object-cover"
                    />

                    <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-3 py-1 rounded-full">
                      {item.course?.category || "Course"}
                    </span>

                    {item.completed && (
                      <span className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
                        Completed
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      {item.course?.title || "Course Deleted"}
                    </h3>

                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {item.course?.description}
                    </p>

                    <div className="flex gap-2 mt-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        Online
                      </span>

                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                        Certificate
                      </span>
                    </div>

                    <p className="text-sm mt-3 text-gray-600">
                      <strong>Instructor:</strong> {item.course?.instructor}
                    </p>

                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>

                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          {item.progress || 0}% Complete
                        </span>
                      </div>

                      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full"
                          style={{ width: `${item.progress || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/learn/${item.course?._id}`)}
                      className="mt-5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:scale-105 transition text-white px-4 py-3 rounded-xl w-full font-semibold"
                    >
                      Continue Learning
                    </button>

                    {!item.completed ? (
                      <button
                        onClick={() => completeCourse(item.course?._id)}
                        className="mt-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:scale-105 transition text-white px-4 py-3 rounded-xl w-full font-semibold"
                      >
                        Mark as Completed
                      </button>
                    ) : (
                      <button
                        onClick={() => getCertificate(item.course?._id)}
                        className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition text-white px-4 py-3 rounded-xl w-full font-semibold"
                      >
                        Download Certificate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}