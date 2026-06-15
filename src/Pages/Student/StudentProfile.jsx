import React, { useEffect, useState } from "react";
import Sidebar from "../../Components/sidebar";
import API from "../../services/api";

export default function StudentProfile() {
  const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [editMode, setEditMode] = useState(false);
  const [enrollments, setEnrollments] = useState([]);

  const [profile, setProfile] = useState({
    name: loggedUser?.name || "Student User",
    email: loggedUser?.email || "student@gmail.com",
    phone: "",
    profileImage:
      "https://ui-avatars.com/api/?name=Student+User&background=4f46e5&color=fff",
    status: "Active",
  });

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
      console.log(error.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("studentProfile");

    if (saved) {
      setProfile(JSON.parse(saved));
    }

    fetchMyCourses();
  }, []);

  useEffect(() => {
    localStorage.setItem("studentProfile", JSON.stringify(profile));
  }, [profile]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((item) => item.completed).length;
  const inProgressCourses = enrollments.filter((item) => !item.completed).length;

  const overallProgress = enrollments.length
    ? Math.round(
        enrollments.reduce((sum, item) => sum + (item.progress || 0), 0) /
          enrollments.length
      )
    : 0;

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-700 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img
                src={
                  profile.profileImage ||
                  `https://ui-avatars.com/api/?name=${profile.name}&background=4f46e5&color=fff`
                }
                alt={profile.name}
                className="w-28 h-28 rounded-full border-4 border-white object-cover"
              />

              <div className="text-center md:text-left flex-1">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-indigo-100 mt-1">{profile.email}</p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                  <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                    {profile.status}
                  </span>
                  <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                    {totalCourses} Courses
                  </span>
                  <span className="bg-white/20 px-4 py-1 rounded-full text-sm">
                    {completedCourses} Certificates
                  </span>
                </div>
              </div>

              <button
                onClick={() => setEditMode(!editMode)}
                className="bg-white text-indigo-700 px-5 py-2 rounded-xl font-semibold hover:bg-indigo-50"
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-6">
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">Enrolled Courses</p>
              <h2 className="text-3xl font-bold mt-2">{totalCourses}</h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">In Progress</p>
              <h2 className="text-3xl font-bold mt-2">{inProgressCourses}</h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">Completed</p>
              <h2 className="text-3xl font-bold mt-2">{completedCourses}</h2>
            </div>

            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-gray-500 text-sm">Overall Progress</p>
              <h2 className="text-3xl font-bold mt-2">{overallProgress}%</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-5">Personal Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <input
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                    disabled={!editMode}
                    className={`w-full border px-3 py-3 rounded-xl mt-1 outline-none ${
                      !editMode ? "bg-gray-100" : "focus:ring-2 focus:ring-indigo-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <input
                    value={profile.email}
                    disabled
                    className="w-full border px-3 py-3 rounded-xl mt-1 bg-gray-100"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="Enter phone number"
                    className={`w-full border px-3 py-3 rounded-xl mt-1 outline-none ${
                      !editMode ? "bg-gray-100" : "focus:ring-2 focus:ring-indigo-500"
                    }`}
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-500">Profile Image URL</label>
                  <input
                    name="profileImage"
                    value={profile.profileImage}
                    onChange={handleChange}
                    disabled={!editMode}
                    placeholder="Image URL"
                    className={`w-full border px-3 py-3 rounded-xl mt-1 outline-none ${
                      !editMode ? "bg-gray-100" : "focus:ring-2 focus:ring-indigo-500"
                    }`}
                  />
                </div>
              </div>

              {editMode && (
                <button
                  onClick={() => setEditMode(false)}
                  className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Save Profile
                </button>
              )}
            </div>

            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-xl font-bold mb-5">Learning Summary</h2>

              <div className="space-y-4">
                {enrollments.length === 0 ? (
                  <p className="text-gray-500">No courses enrolled yet.</p>
                ) : (
                  enrollments.map((item) => (
                    <div key={item._id} className="border-b pb-3">
                      <p className="font-semibold">
                        {item.course?.title || "Course Deleted"}
                      </p>
                      <div className="w-full h-2 bg-gray-200 rounded mt-2">
                        <div
                          className="h-2 bg-indigo-600 rounded"
                          style={{ width: `${item.progress || 0}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.progress || 0}% complete
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}