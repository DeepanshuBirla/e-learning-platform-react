import { useEffect, useState } from "react";
import Sidebar from "../../Components/sidebar";
import Card from "../../Components/Card";
import API from "../../services/api";
import jsPDF from "jspdf";

export default function StudentDashboard() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

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

      // Border
      doc.setDrawColor(0, 51, 153);
      doc.setLineWidth(2);
      doc.rect(10, 10, 277, 190);

      // Header
      doc.setFillColor(0, 51, 153);
      doc.rect(10, 10, 277, 25, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(28);
      doc.text("eLearn LMS", 120, 27);

      // Title
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(30);
      doc.text("CERTIFICATE OF COMPLETION", 60, 55);

      // Subtitle
      doc.setFontSize(16);
      doc.text("This Certificate is Proudly Presented To", 85, 75);

      // Student Name
      doc.setTextColor(0, 51, 153);
      doc.setFontSize(32);
      doc.text(cert.student, 100, 100);

      // Course Text
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text("For Successfully Completing The Course", 80, 120);

      // Course Name
      doc.setTextColor(255, 102, 0);
      doc.setFontSize(24);
      doc.text(cert.course, 95, 140);

      // Date
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text(
        `Issued On: ${new Date(cert.issuedDate).toLocaleDateString()}`,
        20,
        180
      );

      // Signature
      doc.line(220, 170, 270, 170);
      doc.text("Authorized Signature", 220, 178);

      // Footer
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
          <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>

          {loading ? (
            <div className="bg-white shadow p-5 rounded">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="bg-white shadow p-5 rounded">
              No enrolled courses yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {enrollments.map((item) => (
                <div key={item._id} className="bg-white shadow rounded p-4">
                  {item.course?.thumbnail && (
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-full h-40 object-cover rounded mb-3"
                    />
                  )}

                  <h3 className="font-bold text-lg">
                    {item.course?.title || "Course Deleted"}
                  </h3>

                  <p className="text-sm text-gray-600 mt-1">
                    {item.course?.description}
                  </p>

                  <p className="text-sm mt-2">
                    <strong>Instructor:</strong> {item.course?.instructor}
                  </p>

                  <div className="mt-4">
                    <p className="text-sm mb-1">
                      Progress: {item.progress || 0}%
                    </p>

                    <div className="w-full h-3 bg-gray-200 rounded">
                      <div
                        className="bg-blue-600 h-3 rounded"
                        style={{ width: `${item.progress || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {!item.completed ? (
                    <button
                      onClick={() => completeCourse(item.course?._id)}
                      className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
                    >
                      Mark as Completed
                    </button>
                  ) : (
                    <button
                      onClick={() => getCertificate(item.course?._id)}
                      className="mt-4 bg-purple-600 text-white px-4 py-2 rounded w-full"
                    >
                      Download Certificate
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}