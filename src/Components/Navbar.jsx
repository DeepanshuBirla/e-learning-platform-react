import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  const goTo = (path) => {
    navigate(path);
    setMobileMenu(false);
    setMoreOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuth");
    localStorage.removeItem("loggedInUser");

    setMobileMenu(false);
    setMoreOpen(false);

    navigate("/login", { replace: true });
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/courses", label: "Courses" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-blue-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          eLearn
        </Link>

        <div className="hidden md:flex items-center w-1/2 bg-white rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search for courses..."
            className="w-full p-2 text-black outline-none"
          />
          <button className="bg-blue-700 text-white px-4 py-2">Search</button>
        </div>

        <nav className="hidden md:flex gap-8 items-center">
          {navLinks.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "text-amber-400 font-semibold"
                  : "hover:text-amber-400 transition"
              }
            >
              {item.label}
            </NavLink>
          ))}

          {token && (
            <div className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className="hover:text-amber-400 transition"
              >
                More ▾
              </button>

              {moreOpen && (
                <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-lg w-52 z-50">
                  <p className="px-4 py-2 text-sm text-gray-500 border-b">
                    Dashboards
                  </p>

                  <button
                    onClick={() => goTo("/student")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Student Dashboard
                  </button>

                  <button
                    onClick={() => goTo("/admin")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Admin Dashboard
                  </button>

                  <button
                    onClick={() => goTo("/student/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => goTo("/admin/courses")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Manage Courses
                  </button>
                </div>
              )}
            </div>
          )}

          {!token ? (
            <Link
              to="/login"
              className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded font-semibold"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
            >
              Logout
            </button>
          )}
        </nav>

        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>
      </div>

      {mobileMenu && (
        <div className="md:hidden bg-blue-900 px-4 pb-4 space-y-4">
          <div className="flex bg-white rounded overflow-hidden">
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full p-2 text-black outline-none"
            />
            <button className="bg-blue-700 px-4 text-white">Search</button>
          </div>

          {navLinks.map((item) => (
            <button
              key={item.path}
              onClick={() => goTo(item.path)}
              className="block w-full text-left"
            >
              {item.label}
            </button>
          ))}

          {token && (
            <div className="border-t border-blue-700 pt-3 space-y-2">
              <p className="text-sm text-gray-300">Dashboards</p>

              <button onClick={() => goTo("/student")} className="block">
                Student Dashboard
              </button>

              <button onClick={() => goTo("/admin")} className="block">
                Admin Dashboard
              </button>

              <button
                onClick={() => goTo("/student/profile")}
                className="block"
              >
                My Profile
              </button>

              <button
                onClick={() => goTo("/admin/courses")}
                className="block"
              >
                Manage Courses
              </button>
            </div>
          )}

          {!token ? (
            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="block bg-amber-500 text-center py-2 rounded font-semibold"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="block w-full bg-red-500 hover:bg-red-600 px-4 py-2 rounded font-semibold"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}