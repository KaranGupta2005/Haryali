"use client";
import React, { useState } from "react";
import { motion } from "motion/react";
import Sidebar from "@/components/Sidebar";
import { Upload, Sparkles, CheckCircle } from "lucide-react";

export default function ListParali() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);

  const sidebarLinks = [
    { name: "Dashboard", path: "/farmer/dashboard" },
    { name: "List Goods", path: "/farmer/listParali" },
    { name: "AI Price Predictor", path: "/farmer/pricePredictor" },
    { name: "Parali Classifier", path: "/farmer/paraliClassifier" },
  ];

  // 🧠 AI Analyzer simulation
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
        analyzeImage();
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setAnalyzing(true);
    setResults(null);
    setTimeout(() => {
      setAnalyzing(false);
      setResults({
        quality: "Premium Grade",
        moisture: "12%",
        density: "High",
        contamination: "Low",
        estimatedYield: "2.3 tonnes",
        priceRange: "₹4,500–₹5,200/tonne",
      });
    }, 2500);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* ✅ Sidebar */}
      <div className="w-64 bg-white border-r border-green-200 p-4">
        <Sidebar links={sidebarLinks} brand="Farmer Portal" />
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="text-green-600 w-7 h-7" />
            <h1 className="text-3xl font-bold text-green-700">
              AI Parali Quality Analyzer
            </h1>
          </div>
          <p className="text-green-800 text-sm">
            Upload an image of parali to analyze its quality, density, and
            moisture content.
          </p>
        </div>

        {/* Upload + Result Section */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
          {/* Upload Box */}
          <div className="relative w-72 h-72">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="imageUpload"
            />
            <label
              htmlFor="imageUpload"
              className="circular-upload cursor-pointer flex items-center justify-center w-full h-full border-2 border-dashed border-green-400 rounded-full bg-green-50 hover:bg-green-100 transition"
            >
              {!image ? (
                <div className="text-center text-green-700">
                  <Upload className="w-10 h-10 mx-auto mb-2" />
                  <p>Upload Image</p>
                </div>
              ) : (
                <img
                  src={image}
                  alt="Uploaded"
                  className="w-full h-full object-cover rounded-full"
                />
              )}
            </label>
          </div>

          {/* Result Display */}
          <div className="flex-1 text-center">
            {analyzing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1, ease: "easeInOut" }}
                className="text-green-700 font-semibold"
              >
                🔍 Analyzing image...
              </motion.p>
            )}

            {results && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white shadow rounded-xl p-5 border border-green-200 max-w-sm mx-auto"
              >
                <h2 className="font-bold text-green-800 mb-3 flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Analysis Results
                </h2>
                <ul className="text-left text-sm space-y-1 text-green-700">
                  {Object.entries(results).map(([key, val]) => (
                    <li key={key}>
                      <strong className="capitalize">{key}:</strong> {val}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => {
                    setImage(null);
                    setResults(null);
                  }}
                  className="mt-5 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Analyze Another
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

