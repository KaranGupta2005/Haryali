import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

// New Animated SVG for a Greenhouse/Plant Growth (desktop side)
const AnimatedGreenhouse = () => (
  <svg
    width="320"
    height="280"
    viewBox="0 0 320 280"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-64 h-56 md:w-80 md:h-64 mx-auto"
  >
    {/* Greenhouse Structure (Glass) */}
    <rect
      x="50"
      y="50"
      width="220"
      height="180"
      rx="10"
      fill="#ffffff"
      opacity="0.2"
      stroke="#ffffff"
      strokeWidth="2"
      strokeOpacity="0.5"
    />

    {/* Roof line */}
    <path d="M50 50 L160 10 L270 50" stroke="#ffffff" strokeWidth="2" strokeOpacity="0.6" fill="none" />
    <path d="M160 10 L160 230" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.2" />

    {/* Soil Bed */}
    <rect x="60" y="200" width="200" height="30" rx="5" fill="#584b3d" />

    {/* Animated Plant 1 (left) */}
    <g className="animate-[grow-delay-1_5s_infinite_ease-in-out]" style={{ transformOrigin: '70% 200%' }}>
      <path
        d="M80 200 Q75 160, 85 130 T95 100"
        stroke="#4ade80"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      >
        <animate attributeName="d" values="M80 200 Q75 180, 85 150 T95 100; M80 200 Q70 160, 80 120 T90 80; M80 200 Q75 180, 85 150 T95 100" dur="5s" repeatCount="indefinite" />
      </path>
      {/* Leaves */}
      <circle cx="75" cy="150" r="8" fill="#a7f3d0" opacity="0.8" />
      <circle cx="95" cy="140" r="8" fill="#a7f3d0" opacity="0.8" />
    </g>

    {/* Animated Plant 2 (right) */}
    <g className="animate-[grow-delay-2_5s_infinite_ease-in-out]" style={{ transformOrigin: '240% 200%' }}>
      <path
        d="M240 200 Q245 150, 235 120 T225 90"
        stroke="#4ade80"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      >
        <animate attributeName="d" values="M240 200 Q245 180, 235 150 T225 90; M240 200 Q250 160, 240 120 T230 80; M240 200 Q245 180, 235 150 T225 90" dur="5s" begin="2s" repeatCount="indefinite" />
      </path>
      {/* Flower (Blooming) */}
      <circle cx="230" cy="90" r="10" fill="#f87171">
        <animate attributeName="r" values="5;10;5" dur="5s" begin="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="230" cy="90" r="4" fill="#fde047" />
    </g>

    {/* Sun-like Glow (behind greenhouse) */}
    <circle cx="160" cy="120" r="100" fill="#fef08a" opacity="0.05" />
    <circle cx="160" cy="120" r="120" fill="#fef08a" opacity="0.03" />

    <style>
      {`
        @keyframes grow-delay-1 {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.05); }
        }
        @keyframes grow-delay-2 {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.05); }
        }
      `}
    </style>
  </svg>
);

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
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500)); 
      
      // *** Add your actual API logic here to handle login ***

      // Successful fake login
      console.log("Login data:", formData);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen font-sans">
      {/* Improved Background: Darker, richer green with abstract circles */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-green-800 to-lime-950">
        <div className="absolute inset-0 bg-black/40"></div>
        {/* Animated bubbles for an organic feel */}
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
        {/* Tailwind Custom Keyframes (assumes configuration) */}
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
          className={`flex ${isMobile ? "flex-col" : "flex-row"} w-full max-w-5xl min-h-[550px] rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl bg-white/10 border border-white/20`}
        >
          {/* Left: Animated Greenhouse (Desktop Only) */}
          {!isMobile && (
            <div className="flex-1 flex flex-col items-center justify-center p-12 bg-gradient-to-br from-green-800/60 to-lime-700/50 border-r border-white/20 relative">
              <div className="mb-10">{<AnimatedGreenhouse />}</div>
              <h3 className="text-white text-4xl font-extrabold mb-4 tracking-tight">
                Haryali: Smart Farming 🌿
              </h3>
              <p className="text-white/90 text-xl max-w-sm text-center font-light">
                Your platform for sustainable growth. Monitor, manage, and scale your harvest with intelligence.
              </p>
            </div>
          )}

          {/* Right: Login Form */}
          <div
            className={`flex-1 flex flex-col justify-center ${isMobile ? "p-8" : "p-16"} bg-white/10 backdrop-blur-md relative`}
          >
            {/* Header */}
            <div className="text-center mb-10">
              <h2 className="text-5xl font-extrabold text-white mb-3 tracking-tighter">
                Welcome Back
              </h2>
              <p className="text-lime-300 text-lg">
                Sign in to access your dashboard
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
                  <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl transition-colors duration-300 ${focusedField === field ? "text-lime-300" : "text-white/60"}`}>
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
                    className={`w-full pl-16 pr-6 py-4 bg-black/30 border-2 rounded-xl text-white placeholder-white/50 transition-all duration-300 focus:outline-none text-lg ${
                      focusedField === field
                        ? "border-lime-400 bg-black/40 shadow-xl shadow-lime-400/20"
                        : "border-white/30 hover:border-lime-400/50"
                    }`}
                    required
                  />
                </div>
              ))}
              
              {/* Forgot Password Link */}
              <div className="text-right pt-2">
                 <a href="/forgot-password" className="text-sm text-white/70 hover:text-lime-400 transition-colors duration-300">
                    Forgot Password?
                 </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-xl text-green-900 shadow-xl transition-all duration-300 relative overflow-hidden group ${
                  loading
                    ? "opacity-80 cursor-not-allowed bg-green-500"
                    : "bg-gradient-to-r from-lime-400 to-green-300 hover:from-lime-300 hover:to-green-200 hover:scale-[1.02] hover:shadow-2xl hover:shadow-lime-300/40 active:scale-95"
                }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-green-900 border-t-transparent rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    "Login Now 🚀"
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
                <p className="text-white/80 text-md mb-4">
                  Don’t have an account yet?
                </p>
                <NavLink
                  to="/signup"
                  className="text-lime-400 font-bold text-lg hover:text-green-300 transition-all duration-300 hover:scale-105 inline-block border-b-2 border-lime-400 hover:border-green-300 pb-1"
                >
                  Create an Account
                </NavLink>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}