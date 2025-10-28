import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import api from "../api/authApi";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const checkAuth = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setIsAuthenticated(true);
      setUser(res.data.user);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => checkAuth();
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("accessToken");

      window.dispatchEvent(new Event("authChange"));

      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login");
    }
  };

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
  ];

  const authLinks = isAuthenticated
    ? [
        ...publicLinks,
        {
          name: "Dashboard",
          path:
            user?.role === "farmer"
              ? "/farmer/dashboard"
              : user?.role === "buyer"
              ? "/buyer/dashboard"
              : user?.role === "logistics"
              ? "/logistics/dashboard"
              : "/dashboard",
        },
      ]
    : publicLinks;

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
          {authLinks.map(({ name, path }) => (
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

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="ml-2 px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className="ml-2 px-6 py-2.5 bg-gradient-to-r from-lime-500 to-green-500 hover:from-lime-400 hover:to-green-400 text-green-950 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="px-6 py-2.5 border-2 border-lime-400 hover:border-lime-300 text-lime-400 hover:text-white hover:bg-lime-400/10 font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                Sign Up
              </NavLink>
            </>
          )}
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
          {authLinks.map(({ name, path }, index) => (
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

          {/* Mobile Auth Buttons */}
          <div className="pt-4 space-y-3 border-t border-green-700/40 mt-4">
            {isAuthenticated ? (
              <>
                <div className="text-lime-300 text-sm px-4 py-2">
                  Logged in as{" "}
                  <span className="font-semibold">{user?.fullName}</span>
                </div>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-xl py-3 px-4 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-white font-semibold hover:from-red-500 hover:to-red-400 transition-all duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block text-xl py-3 px-4 rounded-lg bg-gradient-to-r from-lime-500 to-green-500 text-green-950 font-semibold text-center hover:from-lime-400 hover:to-green-400 transition-all duration-200"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block text-xl py-3 px-4 rounded-lg border-2 border-lime-400 text-lime-400 font-semibold text-center hover:bg-lime-400/10 transition-all duration-200"
                >
                  Sign Up
                </NavLink>
              </>
            )}
          </div>
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



