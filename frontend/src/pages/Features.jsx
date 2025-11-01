"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MapPin,
  Globe,
  Calendar,
  Shield,
  TrendingUp,
  Star,
  Truck,
  Activity,
  X,
  Leaf,
  Sparkles
} from "lucide-react";
import api from "../api/authApi";
import { NavLink } from "react-router-dom";

const features = [
  {
    id: 1,
    icon: <Activity className="w-8 h-8" />,
    title: "Farmer Onboarding",
    description: "Simple voice or app registration for farmers in regional languages with step-by-step guidance.",
    gradient: "from-emerald-400 to-green-500",
    benefits: ["Multi-language Support", "Voice Registration", "Quick Setup", "24/7 Assistance"]
  },
  {
    id: 2,
    icon: <MapPin className="w-8 h-8" />,
    title: "Interactive Maps",
    description: "Locate farms, view ready-for-pickup listings, and track deliveries in real-time on an intuitive map interface.",
    gradient: "from-green-400 to-emerald-600",
    benefits: ["Real-time Tracking", "Geolocation", "Route Optimization", "Proximity Alerts"]
  },
  {
    id: 3,
    icon: <Calendar className="w-8 h-8" />,
    title: "Harvest Scheduling",
    description: "Farmers set harvest dates and mark 'Ready for Pickup' with automated notifications to buyers.",
    gradient: "from-lime-400 to-green-500",
    benefits: ["Smart Reminders", "Auto Notifications", "Calendar Sync", "Flexible Rescheduling"]
  },
  {
    id: 4,
    icon: <Shield className="w-8 h-8" />,
    title: "Secure Payments",
    description: "Instant UPI payouts with escrow protection and bank-grade encrypted transactions for peace of mind.",
    gradient: "from-green-500 to-emerald-600",
    benefits: ["Instant Transfers", "Escrow Protection", "256-bit Encryption", "Payment History"]
  },
  {
    id: 5,
    icon: <TrendingUp className="w-8 h-8" />,
    title: "AI Price Prediction",
    description: "Predict fair crop residue pricing per ton based on supply, distance, moisture content, and market trends.",
    gradient: "from-teal-400 to-green-500",
    benefits: ["Market Analysis", "Fair Pricing", "Trend Forecasting", "Dynamic Pricing"]
  },
  {
    id: 6,
    icon: <Globe className="w-8 h-8" />,
    title: "Satellite Yield",
    description: "Use NDVI satellite data to estimate crop residue yield before listing with 95% accuracy.",
    gradient: "from-emerald-400 to-teal-500",
    benefits: ["Satellite Imagery", "NDVI Analysis", "Yield Prediction", "Pre-harvest Insights"]
  },
  {
    id: 7,
    icon: <Star className="w-8 h-8" />,
    title: "Green Badges",
    description: "Reward farmers for sustainable practices with gamification, badges, and incentives to reduce crop burning.",
    gradient: "from-green-400 to-lime-500",
    benefits: ["Achievement System", "Leaderboards", "Rewards Program", "Community Recognition"]
  },
  {
    id: 8,
    icon: <Truck className="w-8 h-8" />,
    title: "Impact Counter",
    description: "Track total tonnes of crop residue saved, CO₂ emissions prevented, and farmers positively impacted.",
    gradient: "from-emerald-500 to-green-600",
    benefits: ["Live Statistics", "Environmental Impact", "Social Metrics", "Transparency Reports"]
  }
];

function FeatureCircle({ feature, onClick }) {
  return (
    <motion.div
      className="relative cursor-pointer group"
      onClick={() => onClick(feature)}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="w-40 h-40 rounded-full bg-gradient-to-br from-white/80 to-white/20 shadow-xl flex items-center justify-center group-hover:shadow-2xl transition-all duration-500 border-4 border-green-100 group-hover:border-green-300">
        <div className={`p-4 rounded-full bg-gradient-to-r ${feature.gradient} text-white transform transition-all duration-300 group-hover:scale-110`}>
          {feature.icon}
        </div>
      </div>
      <div className="mt-4 text-center">
        <h3 className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors duration-300">
          {feature.title}
        </h3>
      </div>
    </motion.div>
  );
}

function FeatureModal({ feature, onClose }) {
  if (!feature) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose} 
      >
        <motion.div
          className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden border border-green-100"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()} 
        >
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/50 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-all duration-300 hover:rotate-90 transform"
          >
            <X className="w-6 h-6" />
          </button>

          <div className={`h-40 bg-gradient-to-r ${feature.gradient} relative flex items-center justify-center`}>
            <div className="p-8 rounded-full bg-white/30 backdrop-blur-sm border-2 border-white/40">
              {feature.icon}
            </div>
          </div>

          <div className="p-8 overflow-y-auto max-h-[calc(90vh-10rem)]">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{feature.title}</h2>
            
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {feature.description}
            </p>

            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-green-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-green-600" />
                <h3 className="text-xl font-bold text-gray-900">Key Benefits</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {feature.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient}`} />
                    <span className="text-gray-700 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Features() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/api/auth/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      }
    }
    fetchUser();
  }, []);

  const getDashboardRoute = () => {
    if (user?.role === "farmer") return "/farmer/dashboard";
    if (user?.role === "buyer") return "/buyer/dashboard";
    if (user?.role === "logistics") return "/logistics/dashboard";
    return "/dashboard";
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: "#ABE188" }}>
      <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 px-6 py-16">
        {/* Header */}
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white shadow-lg border border-green-200 mb-6">
            <Leaf className="w-5 h-5 text-green-600" />
            <span className="text-green-600 font-bold text-sm tracking-wide">SUSTAINABLE INNOVATION</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Explore{" "}
            <span className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Haryali Features
            </span>
          </h1>
          
          <p className="text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
            Click on any feature circle to discover how we're revolutionizing crop residue management
          </p>
        </div>

        {/* Feature Grid */}
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 justify-items-center">
          {features.map((feature) => (
            <FeatureCircle
              key={feature.id}
              feature={feature}
              onClick={setSelectedFeature}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-20 text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 border border-green-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Make a Difference?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of farmers and buyers creating a sustainable future
            </p>
            <NavLink to={user ? getDashboardRoute() : "/signup"}>
            <button className="inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <span>Start Your Journey</span>
              <Leaf className="w-6 h-6" />
            </button>
            </NavLink>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <FeatureModal
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
