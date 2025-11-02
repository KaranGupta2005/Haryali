"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import Sidebar from "@/components/Sidebar";

export default function AIPriceYieldPredictor() {
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceVisible, setPriceVisible] = useState(false);
  const [priceData, setPriceData] = useState({
    perTonneRange: "₹0",
    totalRevenue: "₹0",
    logistics: "₹0",
    platform: "₹0",
    payout: "₹0",
  });

  const [yieldLoading, setYieldLoading] = useState(false);
  const [yieldVisible, setYieldVisible] = useState(false);
  const [yieldData, setYieldData] = useState({
    parali: "0 tonnes",
    cropYield: "0 tonnes",
    ratio: "0%",
    revenue: "₹0",
    perAcre: "0 t/acre",
  });

  const sidebarLinks = [
    { name: "Dashboard", path: "/farmer/dashboard" },
    { name: "List Goods", path: "/farmer/listParali" },
    { name: "AI Price Predictor", path: "/farmer/pricePredictor" },
    { name: "Parali Classifier", path: "/farmer/paraliClassifier" },
  ];

  const [particles] = useState(() =>
    Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 6,
      duration: 8 + Math.random() * 6,
      size: 6 + Math.random() * 8,
      opacity: 0.12 + Math.random() * 0.18,
    }))
  );

  // ✅ Handle Price Prediction
  const handlePriceSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const crop = form["price-crop"].value;
    const quantity = parseFloat(form["price-quantity"].value) || 0;
    const distance = parseFloat(form["price-distance"].value) || 0;
    const moisture = parseFloat(form["price-moisture"].value) || 0;
    const demand = form["price-demand"].value;

    if (!crop || quantity <= 0) return;

    setPriceLoading(true);
    setPriceVisible(false);

    setTimeout(() => {
      const basePrices = { paddy: 4500, wheat: 4200, maize: 3800, sugarcane: 5200 };
      const demandMultiplier = { low: 0.85, medium: 1.0, high: 1.2 };
      const moisturePenalty = moisture > 15 ? 0.95 : 1.0;

      let basePrice = basePrices[crop] || 4000;
      basePrice *= (demandMultiplier[demand] || 1) * moisturePenalty;

      const totalRevenue = basePrice * quantity;
      const logisticsCost = distance * 15 * quantity;
      const platformFee = totalRevenue * 0.03;
      const finalPayout = totalRevenue - logisticsCost - platformFee;

      setPriceData({
        perTonneRange: `₹${Math.round(basePrice)} - ₹${Math.round(basePrice * 1.15)}`,
        totalRevenue: `₹${Math.round(totalRevenue)}`,
        logistics: `₹${Math.round(logisticsCost)}`,
        platform: `₹${Math.round(platformFee)}`,
        payout: `₹${Math.max(0, Math.round(finalPayout))}`,
      });

      setPriceLoading(false);
      setPriceVisible(true);
    }, 900);
  };

  const handleYieldSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const crop = form["yield-crop"].value;
    const area = parseFloat(form["yield-area"].value) || 0;
    const season = form["yield-season"].value;
    const soil = form["yield-soil"].value;
    const irrigation = form["yield-irrigation"].value;

    if (!crop || area <= 0) return;

    setYieldLoading(true);
    setYieldVisible(false);

    setTimeout(() => {
      const cropYields = { paddy: 2.5, wheat: 2.2, maize: 2.8, sugarcane: 35 };
      const soilMultiplier = { poor: 0.7, average: 0.9, good: 1.0, excellent: 1.15 };
      const irrigationMultiplier = { rainfed: 0.75, canal: 0.95, tubewell: 1.0, drip: 1.1 };
      const seasonMultiplier = { kharif: 1.0, rabi: 1.05, zaid: 0.9 };
      const residueRatio = { paddy: 1.5, wheat: 1.3, maize: 1.0, sugarcane: 0.3 };

      let baseYield = cropYields[crop] || 2.5;
      const totalCropYield =
        baseYield *
        area *
        (soilMultiplier[soil] || 1) *
        (irrigationMultiplier[irrigation] || 1) *
        (seasonMultiplier[season] || 1);

      const paraliYield = totalCropYield * (residueRatio[crop] || 1);
      const perAcreYield = area > 0 ? paraliYield / area : 0;
      const estimatedRevenue = paraliYield * 4000; 

      setYieldData({
        parali: `${paraliYield.toFixed(2)} tonnes`,
        cropYield: `${totalCropYield.toFixed(2)} tonnes`,
        ratio: `${Math.round((residueRatio[crop] || 1) * 100)}%`,
        revenue: `₹${Math.round(estimatedRevenue)}`,
        perAcre: `${perAcreYield.toFixed(2)} t/acre`,
      });

      setYieldLoading(false);
      setYieldVisible(true);
    }, 900);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 text-emerald-900">
      {/* ✅ Sidebar on the left */}
      <Sidebar links={sidebarLinks} brand="Farmer Portal" />

      {/* ✅ Main Content Area */}
      <div className="flex-1 relative overflow-hidden py-8 px-6">
        {/* Floating Particles */}
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: -720, opacity: [0, p.opacity, 0] }}
            transition={{
              delay: p.delay,
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="pointer-events-none rounded-full bg-emerald-300"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              position: "fixed",
              bottom: -40,
            }}
          />
        ))}

        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
              🌾 AI Price & Yield Predictor
            </h1>
            <p className="mt-2 text-emerald-700">
              Smart predictions powered by lightweight models — designed for farmers & aggregators
            </p>
          </header>

          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ✅ Price Predictor Card */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="relative bg-white/70 backdrop-blur-md border border-emerald-200 rounded-2xl p-6 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl bg-gradient-to-br from-emerald-600 to-emerald-400">
                  ₹
                </div>
                <h2 className="text-xl font-semibold text-emerald-800">Price Predictor</h2>
              </div>

              {/* Price Form */}
              <form onSubmit={handlePriceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-emerald-700">Crop Type</label>
                  <select
                    name="price-crop"
                    required
                    className="mt-2 w-full rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  >
                    <option value="">Select Crop</option>
                    <option value="standing_stubble">Standing Stubble</option>
                    <option value="loose_straw">Loose Straw</option>
                    <option value="paddy">Paddy (Rice)</option>
                    <option value="wheat">Wheat</option>
                    <option value="maize">Maize</option>
                    <option value="sugarcane">Sugarcane</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    name="price-quantity"
                    type="number"
                    placeholder="Quantity (tonnes)"
                    required
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                  />
                  <input
                    name="price-distance"
                    type="number"
                    placeholder="Distance to Buyer (km)"
                    required
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    name="price-moisture"
                    type="number"
                    placeholder="Moisture Content (%)"
                    required
                    className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 text-white shadow-md"
                  type="submit"
                  disabled={priceLoading}
                >
                  {priceLoading ? "Calculating..." : "Calculate Fair Price"}
                </motion.button>
              </form>

              {priceVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-6 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
                >
                  <div className="text-sm font-semibold text-emerald-700">💰 Predicted Price</div>
                  <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                    {priceData.perTonneRange}
                  </div>
                </motion.div>
              )}
            </motion.section>

            {/* ✅ Yield Estimator */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="relative bg-white/70 backdrop-blur-md border border-emerald-200 rounded-2xl p-6 shadow-lg overflow-hidden"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl bg-gradient-to-br from-emerald-600 to-emerald-400">
                  🌱
                </div>
                <h2 className="text-xl font-semibold text-emerald-800">Yield Estimator</h2>
              </div>

              <form onSubmit={handleYieldSubmit} className="space-y-4">
                <input
                  name="yield-crop"
                  placeholder="Crop Type (paddy, wheat...)"
                  required
                  className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                />
                <input
                  name="yield-area"
                  placeholder="Cultivated Area (acres)"
                  type="number"
                  required
                  className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                />
                <select
                  name="yield-soil"
                  className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                >
                  <option value="">Soil Quality</option>
                  <option value="poor">Poor</option>
                  <option value="average">Average</option>
                  <option value="good">Good</option>
                  <option value="excellent">Excellent</option>
                </select>
                <select
                  name="yield-irrigation"
                  className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                >
                  <option value="">Irrigation Type</option>
                  <option value="rainfed">Rainfed</option>
                  <option value="canal">Canal</option>
                  <option value="tubewell">Tubewell</option>
                  <option value="drip">Drip</option>
                </select>
                <select
                  name="yield-season"
                  className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2"
                >
                  <option value="">Season</option>
                  <option value="kharif">Kharif</option>
                  <option value="rabi">Rabi</option>
                  <option value="zaid">Zaid</option>
                </select>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 text-white shadow-md"
                >
                  {yieldLoading ? "Calculating..." : "Estimate Yield"}
                </motion.button>
              </form>

              {yieldVisible && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="mt-6 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-white border border-emerald-100"
                >
                  <div className="text-sm font-semibold text-emerald-700">📊 Estimated Yield</div>
                  <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                    {yieldData.parali}
                  </div>
                </motion.div>
              )}
            </motion.section>
          </main>

          <footer className="mt-8 text-center text-xs text-emerald-700">
            Tip: Use accurate moisture and distance values for better price estimates.
          </footer>
        </div>
      </div>
    </div>
  );
}
