import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/authApi";

export default function Sidebar({ links = [], brand = "Haryali" }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-bl from-green-200 via-lime-100 to-green-100 p-7 rounded-3xl shadow-2xl flex flex-col space-y-6 sticky top-0 z-20">
      <h2 className="text-3xl font-extrabold text-green-800 tracking-tight mb-6 bg-gradient-to-r from-lime-600/70 to-green-700/80 bg-clip-text text-transparent">
        🌾 {brand}
      </h2>
      {links.map((link) => (
        <NavLink
          key={link.name}
          to={link.path}
          className={({ isActive }) =>
            `block px-5 py-3 rounded-xl font-semibold transition-all duration-150 shadow-sm hover:bg-green-200/60 hover:scale-[1.03] ${
              isActive
                ? "bg-green-300 text-white shadow-lg scale-[1.08]"
                : "text-green-900 border border-green-100"
            }`
          }
        >
          <span className="mr-1">{link.icon}</span> {link.name}
        </NavLink>
      ))}
      
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-auto block px-5 py-3 rounded-xl font-semibold transition-all duration-150 shadow-sm hover:bg-red-200/60 hover:scale-[1.03] text-red-700 border border-red-200 hover:border-red-300"
      >
        Logout
      </button>
      
      <div className="pt-4 text-xs text-green-500 opacity-60">
        © 2025 Haryali Tech
      </div>
    </aside>
  );
}
