import { useEffect, useState } from "react";
import Sidebar from "../Components/sidebar";
import API from "../services/api";

export default function TestHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttempts = async () => {
    try {
      const res = await API.get("/test-attempts");
      setAttempts(res.data.attempts || []);
    } catch (error) {
  console.log("TEST HISTORY ERROR:", error.response?.data || error.message);
  alert(error.response?.data?.message || "Failed to load test history");
} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttempts();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-gray-100 min-h-screen w-full">
          Loading test history...
        </div>
      </div>
    );
  }

  if (attempts.length === 0) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="p-6 bg-gray-100 min-h-screen w-full">
          No test attempts yet
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />

      <div className="min-h-screen bg-gray-100 p-6 w-full">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow">
          <h2 className="text-2xl font-bold mb-4">🧾 Test Attempt History</h2>

          <div className="overflow-x-auto">
            <table className="w-full border text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border p-3">Course ID</th>
                  <th className="border p-3">Date</th>
                  <th className="border p-3">Score</th>
                  <th className="border p-3">Percentage</th>
                  <th className="border p-3">Result</th>
                </tr>
              </thead>

              <tbody>
                {attempts.map((h) => (
                  <tr key={h._id} className="text-center">
                    <td className="border p-3">
  {h.course?.title || "Course Deleted"}
</td>
                    <td className="border p-3">
                      {new Date(h.createdAt).toLocaleString()}
                    </td>
                    <td className="border p-3">
                      {h.score}/{h.total}
                    </td>
                    <td className="border p-3">{h.percentage}%</td>
                    <td className="border p-3">
                      {h.passed ? (
                        <span className="text-green-600 font-semibold">
                          ✅ Pass
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          ❌ Fail
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}