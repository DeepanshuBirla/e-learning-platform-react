import { NavLink, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isStudent = location.pathname.startsWith("/student");
  const isAffiliate = location.pathname.startsWith("/affiliate");

  let title = "Admin Panel";
  let links = [
    { path: "/admin", label: "Dashboard", icon: "📊" },
    { path: "/admin/students", label: "Students", icon: "👨‍🎓" },
    { path: "/admin/affiliates", label: "Affiliates", icon: "🤝" },
    { path: "/admin/courses", label: "Courses", icon: "📚" },
  ];
if (isStudent) {
  title = "Student Panel";
  links = [
    { path: "/student", label: "Dashboard", icon: "🏠" },
    { path: "/student/profile", label: "Profile", icon: "👤" },
  ];
}

  if (isAffiliate) {
    title = "Affiliate Panel";
    links = [
      { path: "/affiliate/dashboard", label: "Dashboard", icon: "📊" },
      { path: "/affiliate/my-profile", label: "My Profile", icon: "👤" },
      { path: "/affiliate/withdrawal-request", label: "Withdrawal", icon: "💰" },
      { path: "/affiliate/download-report", label: "Reports", icon: "📄" },
      { path: "/affiliate/generate-url", label: "Generate URL", icon: "🔗" },
    ];
  }

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-700 text-white px-3 py-2 rounded shadow"
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        ></div>
      )}

      <aside
        className={`fixed md:static z-40 bg-slate-950 text-white min-h-screen w-64 p-5
        ${open ? "left-0" : "-left-64"} md:left-0 transition-all duration-300`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">{title}</h1>
          <p className="text-sm text-gray-400 mt-1">eLearn Management</p>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <NavLink
              key={link.label}
              to={link.path}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white shadow"
                    : "text-gray-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 text-xs text-gray-500 pt-4">
  © 2026 eLearn LMS
</div>
      </aside>
    </>
  );
}