import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [focusedField, setFocusedField] = useState("");

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
      
      console.log("Login data:", formData);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Background: */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-950 via-green-900 to-lime-950">
        <div className="absolute inset-0 bg-black/40"></div>
        {Array.from({ length: 10 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-lime-300/10 rounded-full animate-bubble"
            style={{
              width: `${Math.random() * 40 + 20}px`,
              height: `${Math.random() * 40 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 8 + 4}s`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        
        <style>
            {`
              @keyframes bubble {
                  0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
                  50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
              }
              .animate-bubble {
                  animation: bubble infinite alternate ease-in-out;
              }
            `}
        </style>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div
          className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20`}
        >
          {/* Left Image*/}
          {!isMobile && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-green-800/70 to-lime-700/60 border-r border-white/20 relative">
              <div className="mb-8 p-4 rounded-full bg-black/20 backdrop-blur-sm border border-white/30">
                <img src="/leaf.png" alt="Haryali Platform" className="w-full h-full rounded-[50%]" />
              </div>
              <h3 className="text-white text-3xl font-extrabold mb-3 tracking-tight">
                Haryali Platform
              </h3>
              <p className="text-white/80 text-lg max-w-sm text-center font-light">
                Manage, Monitor, and Grow Smarter. Access your data anytime, anywhere.
              </p>
            </div>
          )}

          {/* Right: Login Form */}
          <div
            className={`flex-1 flex flex-col justify-center ${isMobile ? "p-8" : "p-12"} bg-black/30 backdrop-blur-md relative`}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tighter">
                Welcome Back 
              </h2>
              <p className="text-lime-300 text-lg">
                Enter your credentials to continue
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                {
                  field: "email",
                  icon: "📧",
                  placeholder: "Email Address",
                  type: "email",
                },
                {
                  field: "password",
                  icon: "🔒",
                  placeholder: "Password",
                  type: "password",
                },
              ].map(({ field, icon, placeholder, type }) => (
                <div key={field} className="relative group">
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl transition-colors duration-300 ${focusedField === field ? "text-lime-300" : "text-white/50"}`}>
                    {icon}
                  </div>
                  <input
                    type={type}
                    name={field}
                    placeholder={placeholder}
                    value={formData[field]}
                    onChange={handleChange}
                    onFocus={() => setFocusedField(field)}
                    onBlur={() => setFocusedField("")}
                    className={`w-full pl-16 pr-6 py-4 bg-white/10 border-2 rounded-xl text-white placeholder-white/60 transition-all duration-300 focus:outline-none text-lg ${
                      focusedField === field
                        ? "border-lime-400 bg-white/15 shadow-xl shadow-lime-400/20"
                        : "border-white/20 hover:border-lime-400/50"
                    }`}
                    required
                  />
                </div>
              ))}
              
              {/* Forgot Password Link */}
              <div className="text-right pt-1">
                 <a href="/forgot-password" className="text-sm text-white/70 hover:text-lime-400 transition-colors duration-300">
                    Forgot Password?
                 </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-xl text-green-950 shadow-xl transition-all duration-300 relative group ${
                  loading
                    ? "opacity-70 cursor-not-allowed bg-green-500"
                    : "bg-gradient-to-r from-lime-400 to-green-300 hover:from-lime-300 hover:to-green-200 hover:scale-[1.01] hover:shadow-2xl hover:shadow-lime-300/40 active:scale-[0.99]"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-green-950 border-t-transparent rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    "Login Securely"
                  )}
                </span>
              </button>

              {error && (
                <div className="text-red-300 text-center bg-red-900/40 p-4 rounded-xl border border-red-500/50 backdrop-blur-md">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-2xl">🚨</span>
                    <p className="font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Bottom link */}
              <div className="text-center pt-8 border-t border-white/10 mt-8">
                <p className="text-white/80 text-md mb-3">
                  Don’t have an account?
                </p>
                <NavLink
                  to="/signup"
                  className="text-lime-400 font-bold text-lg hover:text-green-300 transition-all duration-300 hover:scale-105 inline-block border-b-2 border-lime-400 hover:border-green-300 pb-1"
                >
                  🌱 Sign Up for Haryali
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}