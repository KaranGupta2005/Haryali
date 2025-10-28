import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import api from "../api/authApi";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/login", formData);

      console.log("✅ Logged in:", res.data);
      
      const userRole = res.data.user.role;
      
      if (userRole === "farmer") {
        navigate("/farmer/dashboard");
      } else if (userRole === "buyer") {
        navigate("/buyer/dashboard");
      } else if (userRole === "logistics") {
        navigate("/logistics/dashboard");
      } else if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans overflow-hidden">
      {/* Animated Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-gradient-to-br from-green-950 via-green-900 to-lime-950"
      >
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-lime-300/10 rounded-full blur-sm"
            style={{
              width: `${Math.random() * 50 + 20}px`,
              height: `${Math.random() * 50 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20`}
        >
          {/* Left Section */}
          {!isMobile && (
            <motion.div
              initial={{ x: -40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-green-800/70 to-lime-700/60 border-r border-white/20"
            >
              <div className="mb-8 p-4 rounded-full bg-black/20 border border-white/30">
                <img src="/leaf.png" alt="Haryali" className="w-28 h-28 rounded-full" />
              </div>
              <h3 className="text-white text-3xl font-extrabold mb-3 tracking-tight">
                Haryali Platform
              </h3>
              <p className="text-white/80 text-lg text-center max-w-sm font-light">
                Empowering farmers and industries through sustainable connections.
              </p>
            </motion.div>
          )}

          {/* Right Section */}
          <div className={`flex-1 flex flex-col justify-center ${isMobile ? "p-8" : "p-12"} bg-black/30 backdrop-blur-md`}>
            <div className="text-center mb-8">
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl font-extrabold text-white mb-2"
              >
                Welcome Back 👋
              </motion.h2>
              <p className="text-lime-300 text-lg">
                Log in to continue your green journey
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { name: "email", type: "email", placeholder: "Email Address", icon: "📧" },
                { name: "password", type: "password", placeholder: "Password", icon: "🔒" },
              ].map(({ name, type, placeholder, icon }) => (
                <div key={name} className="relative">
                  <span
                    className={`absolute left-4 top-1/2 -translate-y-1/2 text-2xl transition-colors ${
                      focusedField === name ? "text-lime-300" : "text-white/50"
                    }`}
                  >
                    {icon}
                  </span>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    value={formData[name]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(name)}
                    onBlur={() => setFocusedField("")}
                    className={`w-full pl-14 pr-5 py-4 rounded-xl text-white bg-white/10 placeholder-white/60 border-2 text-lg transition-all duration-300 focus:outline-none ${
                      focusedField === name
                        ? "border-lime-400 bg-white/15 shadow-xl shadow-lime-400/20"
                        : "border-white/20 hover:border-lime-400/50"
                    }`}
                    required
                  />
                </div>
              ))}

              <div className="text-right">
                <a href="/forgot-password" className="text-sm text-white/70 hover:text-lime-400 transition">
                  Forgot Password?
                </a>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-xl text-green-950 shadow-xl transition-all duration-300 ${
                  loading
                    ? "opacity-70 cursor-not-allowed bg-green-500"
                    : "bg-gradient-to-r from-lime-400 to-green-300 hover:from-lime-300 hover:to-green-200 hover:scale-[1.01] hover:shadow-2xl hover:shadow-lime-300/40"
                }`}
              >
                <span className="flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-green-950 border-t-transparent rounded-full animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    "Login Securely"
                  )}
                </span>
              </motion.button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-300 text-center bg-red-900/40 p-4 rounded-xl border border-red-500/50 backdrop-blur-md"
                >
                  {error}
                </motion.div>
              )}

              <div className="text-center pt-8 border-t border-white/10 mt-8">
                <p className="text-white/80 text-md mb-3">Don't have an account?</p>
                <NavLink
                  to="/signup"
                  className="text-lime-400 font-bold text-lg hover:text-green-300 transition-all duration-300 hover:scale-105 inline-block border-b-2 border-lime-400 hover:border-green-300 pb-1"
                >
                  🌱 Sign Up for Haryali
                </NavLink>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}