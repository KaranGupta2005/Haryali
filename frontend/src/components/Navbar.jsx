import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "Contact", path: "/contact" },
  ];

  const baseLink =
    "relative px-4 py-2 text-green-100 hover:text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gradient-to-r after:from-lime-300 after:to-emerald-400 after:rounded-full after:scale-x-0 after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 transition-all duration-200 text-lg lg:text-xl tracking-wide font-medium";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-r from-emerald-900/95 via-green-900/95 to-emerald-800/95 backdrop-blur-2xl shadow-2xl h-20 border-b border-green-600/40"
          : "bg-gradient-to-r from-green-950/95 via-emerald-900/95 to-green-800/90 backdrop-blur-xl shadow-lg h-24 border-b border-green-700/50"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="flex items-center gap-3 lg:gap-4 group"
          aria-label="Haryali Home"
        >
          <div
            className={`transition-all duration-300 ${
              scrolled ? "h-12 w-12" : "h-16 w-16 lg:h-20 lg:w-20"
            } border-[3px] border-lime-400 rounded-full overflow-hidden flex items-center justify-center bg-white/10 group-hover:border-emerald-300 group-hover:shadow-lg group-hover:shadow-green-400/40`}
          >
            <img
              src="/logo.png"
              alt="Haryali Logo"
              className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
            />
          </div>

          <div className="hidden sm:block">
            <span
              className={`transition-all duration-300 ${
                scrolled ? "text-xl lg:text-2xl" : "text-2xl lg:text-4xl"
              } font-extrabold text-green-100 tracking-wide drop-shadow-xl group-hover:text-white`}
            >
              Haryali
            </span>
            <div
              className={`transition-all duration-300 ${
                scrolled
                  ? "text-xs lg:text-sm mt-0.5"
                  : "text-sm lg:text-base mt-1"
              } font-semibold tracking-wide leading-tight text-lime-300 group-hover:text-emerald-200`}
            >
              Turning Smoke to Income
            </div>
          </div>
        </NavLink>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-2 lg:gap-5">
          {navLinks.map(({ name, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `${baseLink} ${
                  isActive
                    ? "text-white font-semibold scale-105 after:scale-x-100"
                    : ""
                }`
              }
            >
              {name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen((prev) => !prev)}
          className="md:hidden text-green-100 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 p-2 rounded-lg hover:bg-green-800/50"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed inset-0 top-20 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed top-20 left-0 right-0 bg-gradient-to-b from-green-950/98 via-emerald-900/98 to-green-800/95 backdrop-blur-xl border-t border-green-700/40 shadow-2xl transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-6 space-y-2">
          {navLinks.map(({ name, path }, index) => (
            <NavLink
              key={name}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `block text-xl py-3 px-4 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-green-700/70 to-emerald-700/70 font-bold text-white scale-105 shadow-lg"
                    : "text-green-100 hover:text-white hover:bg-green-800/40 hover:translate-x-2"
                }`
              }
              style={{
                animationDelay: `${index * 50}ms`,
                animation: mobileOpen
                  ? "slideIn 0.35s ease-out forwards"
                  : "none",
              }}
            >
              {name}
            </NavLink>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </nav>
  );
}

