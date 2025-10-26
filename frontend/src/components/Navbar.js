import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Contact", path: "/contact" },
  ];

  const baseLink =
    "relative px-4 py-2 text-green-100 hover:text-green-50 after:block after:scale-x-0 after:bg-green-400 after:h-[2px] after:rounded-full after:transition-transform hover:after:scale-x-100 transition-all duration-200 text-lg lg:text-xl tracking-wide";

  return (
    <nav className="fixed top-0 z-50 w-full bg-gradient-to-b from-green-900/95 to-green-800/95 backdrop-blur-xl border-b border-green-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-24 flex justify-between items-center">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-4">
          <div className="h-22 w-22 border-4 border-green-400 rounded-full overflow-hidden flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Haryali Logo"
              className="h-full w-full object-contain hover:scale-110 transition-transform duration-300 drop-shadow-lg"
            />
          </div>

          <span className="text-2xl lg:text-4xl font-extrabold text-green-100 tracking-wide drop-shadow-xl hidden sm:block">
            Haryali
            <div className="my-2 text-2xl font-bold tracking-wide leading-tight text-green-300">
              Turning Smoke to Income
            </div>
          </span>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive ? "text-white font-semibold scale-110" : ""
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="text-green-100 hover:scale-110 transition-transform"
          >
            {mobileOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-green-900/95 text-white px-6 pb-5 space-y-4 border-t border-green-700">
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block text-xl transition-all duration-200 ${
                  isActive
                    ? "scale-110 font-bold text-green-400"
                    : "hover:text-green-400"
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}

