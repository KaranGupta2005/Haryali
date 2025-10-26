import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [role, setRole] = useState("");
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
      await new Promise((resolve) => setTimeout(resolve, 1500));
      if (role === "Farmer") navigate("/farmer/dashboard");
      else if (role === "Buyer") navigate("/buyer/dashboard");
      else if (role === "Logistics") navigate("/logistics/dashboard");
      else setError("Select a valid role to continue.");
    } catch {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { field: "name", placeholder: "Full Name", type: "text" },
    { field: "email", placeholder: "Email Address", type: "email" },
    { field: "password", placeholder: "Password", type: "password" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-lime-700 to-green-900 p-4">
      <div
        className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md border border-white/10`}
      >
        {/* Left section (image & tagline) */}
        {!isMobile && (
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex flex-col items-center justify-center p-10 border-r border-white/10 relative"
          >
            <motion.img
              src="/farm-field.jpg"
              alt="Field"
              className="w-80 h-64 md:w-96 md:h-72 rounded-3xl object-cover shadow-lg mb-6"
              initial={{ y: 0 }}
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <h3 className="text-white text-3xl font-bold mb-5 bg-gradient-to-r from-green-300 via-lime-200 to-yellow-200 bg-clip-text text-transparent">
              Grow with Haryali 🌱
            </h3>
            <p className="text-white/80 text-lg max-w-sm text-center">
              Sign up to join the movement for smarter, greener farming in India.
            </p>
          </motion.div>
        )}

        {/* Right section (form) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className={`flex-1 flex flex-col justify-center ${
            isMobile ? "p-8" : "p-16"
          } bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-md relative`}
        >
          {isMobile ? (
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400/30 to-yellow-300/30 rounded-full flex items-center justify-center border border-green-300/30">
                <span className="text-3xl">🌾</span>
              </div>
              <h3 className="text-lime-300 text-2xl font-bold mb-2 bg-gradient-to-r from-green-300 to-yellow-300 bg-clip-text text-transparent">
                Sign Up for Haryali
              </h3>
              <p className="text-white/80 text-sm">Join the harvest community!</p>
            </div>
          ) : (
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-green-200 via-lime-200 to-yellow-200 bg-clip-text text-transparent">
                Create Your Haryali Account
              </h2>
              <p className="text-white/70 text-lg">
                Get started with sustainable field management!
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {inputFields.map(({ field, placeholder, type }) => (
              <div key={field} className="relative group">
                <input
                  type={type}
                  name={field}
                  placeholder={placeholder}
                  value={formData[field]}
                  onChange={handleChange}
                  onFocus={() => setFocusedField(field)}
                  onBlur={() => setFocusedField("")}
                  className={`w-full pl-6 pr-6 py-4 bg-white/10 backdrop-blur-md border-2 rounded-2xl text-white placeholder-white/55 transition-all duration-300 ${
                    focusedField === field
                      ? "border-green-400 bg-white/20 shadow-lg shadow-lime-400/20 scale-105"
                      : "border-white/20 hover:border-green-300/50"
                  }`}
                  required
                />
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-green-300/20 to-yellow-200/20 opacity-0 transition-opacity duration-300 pointer-events-none ${
                    focusedField === field ? "opacity-100" : ""
                  }`}
                ></div>
              </div>
            ))}

            {/* Role Dropdown */}
            <div className="relative group">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-5 py-4 rounded-2xl bg-white/10 text-white border-2 border-white/20 focus:border-green-400 transition-all duration-300 appearance-none cursor-pointer backdrop-blur-md focus:bg-white/15 hover:border-green-300/50"
                required
              >
                <option value="" className="bg-gray-800 text-white">
                  Select Your Role
                </option>
                <option value="Farmer" className="bg-gray-800 text-white">
                  Farmer
                </option>
                <option value="Buyer" className="bg-gray-800 text-white">
                  Buyer
                </option>
                <option value="Logistics" className="bg-gray-800 text-white">
                  Logistics
                </option>
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-lime-200 pointer-events-none text-xl">
                ▼
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg transition-all duration-300 relative overflow-hidden group ${
                loading
                  ? "opacity-70 cursor-not-allowed bg-green-600/50"
                  : "bg-gradient-to-r from-green-700 to-lime-500 hover:from-green-600 hover:to-lime-400 hover:scale-105 hover:shadow-xl hover:shadow-green-300/30 active:scale-95"
              }`}
            >
              <span className="relative z-10">
                {loading ? "Creating Your Haryali Account..." : "🌱 Sign Up"}
              </span>
            </button>

            {/* Error Message */}
            {error && (
              <div className="text-red-200 text-center bg-red-600/20 p-4 rounded-2xl border border-red-400/40 backdrop-blur-md">
                {error}
              </div>
            )}

            {/* Footer / Login link */}
            <div className="text-center pt-6 border-t border-white/10">
              <p className="text-white/70 text-sm mb-3">
                Already have an account?
              </p>
              <NavLink
                to="/login"
                className="text-lime-400 font-semibold hover:text-green-300 transition-all duration-300 hover:scale-105 px-4 py-2 rounded-lg hover:bg-white/5 inline-block"
              >
                🌾 Login to Dashboard
              </NavLink>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
