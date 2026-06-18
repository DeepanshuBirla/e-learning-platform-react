import { useEffect, useState } from "react";
import Sidebar from "../../Components/sidebar";
import Card from "../../Components/Card";
import API from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    attempts: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await API.get("/admin/stats");
      setStats(res.data);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load admin stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />

        <div className="flex-1 bg-gray-100 min-h-screen p-6">
          <div className="bg-white rounded shadow p-5">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-gray-100 min-h-screen">
        <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card title="Total Users" value={stats.users} />
          <Card title="Total Courses" value={stats.courses} />
          <Card title="Enrollments" value={stats.enrollments} />
          <Card title="Quiz Attempts" value={stats.attempts} />
        </div>

        <div className="p-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-2">Admin Analytics</h2>
            <p className="text-gray-500">
              These numbers are coming from MongoDB database.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700">Users</h3>
                <p className="text-3xl font-bold mt-2">{stats.users}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700">Courses</h3>
                <p className="text-3xl font-bold mt-2">{stats.courses}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700">Enrollments</h3>
                <p className="text-3xl font-bold mt-2">{stats.enrollments}</p>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-gray-700">Quiz Attempts</h3>
                <p className="text-3xl font-bold mt-2">{stats.attempts}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}