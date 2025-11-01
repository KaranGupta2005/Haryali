"use client";

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import FeaturesSection from "../components/FeatureSection";
import { BackgroundRippleEffect } from "@/components/ui/BackgroundRippleEffect";
import { Upload, Brain, CheckCircle, Pill, Volume2 } from "lucide-react";
import api from "../api/authApi";
import { FlipWords } from "@/components/ui/FlipWords";

export default function Home() {
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
    <>
      {/* Hero Section */}
      <div
        className="relative h-screen w-screen bg-center bg-cover bg-no-repeat overflow-hidden flex items-start justify-center"
        style={{ backgroundImage: "url('/background.png')" }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/40 via-black/40 to-green-800/80 z-10"></div>

        {/* Background ripple effect */}
        <BackgroundRippleEffect rows={8} cols={27} cellSize={60} />

        {/* Hero Content */}
        <div className="relative z-20 flex flex-col items-center justify-start text-center mt-20 px-4 h-full">
          {/* Hero Title */}
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-extrabold text-green-900 tracking-wide"
          >
            <FlipWords words={["Turn", "Transform", "Convert"]} />
          </motion.h1>

          {/* Hero Subtitle */}
          <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-6 text-3xl md:text-4xl lg:text-5xl font-serif font-extrabold italic text-green-100 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            Crop Residue to Income
          </motion.p>

          {/* Buttons */}
          <div className="flex flex-col md:flex-row justify-center mt-12 items-center gap-6 md:gap-10">
            {[
              { label: "Explore Dashboard", to: getDashboardRoute() },
              { label: "Learn More", to: "/about" },
            ].map((btn, idx) => (
              <NavLink key={idx} to={btn.to}>
                <motion.button
                  whileHover={{
                    scale: 1.08,
                    boxShadow: "0 0 20px rgba(72, 187, 120, 0.6)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="px-8 py-4 rounded-2xl border border-green-700 text-green-900 font-semibold text-lg backdrop-blur-md bg-white/60 hover:bg-green-600/30 hover:text-white transition-all duration-300 ease-in-out"
                >
                  {btn.label}
                </motion.button>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />
    </>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      icon: <Upload size={32} />,
      label: "Upload Photo",
      description: "Take or upload a photo of your crop",
    },
    {
      icon: <Brain size={32} />,
      label: "AI Analysis",
      description: "Our AI analyzes the image instantly",
    },
    {
      icon: <CheckCircle size={32} />,
      label: "Identification",
      description: "Disease/pest identified accurately",
    },
    {
      icon: <Pill size={32} />,
      label: "Remedy",
      description: "Get organic & chemical treatment options",
    },
    {
      icon: <Volume2 size={32} />,
      label: "Audio Summary",
      description: "Listen to guidance in your language",
    },
  ];

  return (
    <section className="py-24 bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400">
              Haryali
            </span>{" "}
            Works
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From crop residue listing to payment - we handle everything for you
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 relative">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="flex flex-col items-center text-center relative z-10"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[50%] w-full h-0.5 bg-gradient-to-r from-green-500/50 to-transparent" />
              )}

              <motion.div
                whileHover={{ scale: 1.15 }}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-green-500/30 transition-transform duration-300"
              >
                {step.icon}
              </motion.div>
              <h3 className="text-lg font-bold text-white mb-2">
                {step.label}
              </h3>
              <p className="text-sm text-gray-400 max-w-[160px]">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

