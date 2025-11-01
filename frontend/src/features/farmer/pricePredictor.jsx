import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

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
      const basePrices = {
        paddy: 4500,
        wheat: 4200,
        maize: 3800,
        sugarcane: 5200,
      };

      const demandMultiplier = { low: 0.85, medium: 1.0, high: 1.2 };
      const moisturePenalty = moisture > 15 ? 0.95 : 1.0;

      let basePrice = basePrices[crop] || 4000;
      basePrice = basePrice * (demandMultiplier[demand] || 1) * moisturePenalty;

      const totalRevenue = basePrice * quantity;
      const logisticsCost = distance * 15 * quantity; // ₹15 per km per tonne
      const platformFee = totalRevenue * 0.03; // 3% fee
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
        baseYield * area * (soilMultiplier[soil] || 1) * (irrigationMultiplier[irrigation] || 1) * (seasonMultiplier[season] || 1);

      const paraliYield = totalCropYield * (residueRatio[crop] || 1);
      const perAcreYield = area > 0 ? paraliYield / area : 0;
      const estimatedRevenue = paraliYield * 4000; // ₹4000 per tonne

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

  useEffect(() => {
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-emerald-100 to-emerald-200 text-emerald-900 py-8 px-4">
      {/* Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: -720, opacity: [0, p.opacity, 0] }}
          transition={{ delay: p.delay, duration: p.duration, repeat: Infinity, ease: "linear" }}
          className="pointer-events-none rounded-full bg-emerald-300"
          style={{ width: p.size, height: p.size, left: `${p.left}%`, position: "fixed", bottom: -40 }}
        />
      ))}

      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-700 to-emerald-500">
            🌾 AI Price & Yield Predictor
          </h1>
          <p className="mt-2 text-emerald-700">Smart predictions powered by lightweight models — designed for farmers & aggregators</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="relative bg-white/70 backdrop-blur-md border border-emerald-200 rounded-2xl p-6 shadow-lg overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl bg-gradient-to-br from-emerald-600 to-emerald-400">₹</div>
              <h2 className="text-xl font-semibold text-emerald-800">Price Predictor</h2>
            </div>

            <form onSubmit={handlePriceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700">Crop Type</label>
                <select name="price-crop" required className="mt-2 w-full rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  <option value="">Select Crop</option>
                  <option value="paddy">Paddy (Rice)</option>
                  <option value="wheat">Wheat</option>
                  <option value="maize">Maize</option>
                  <option value="sugarcane">Sugarcane</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-700">Quantity (tonnes)</label>
                  <input name="price-quantity" type="number" step="0.1" min="0.1" required placeholder="e.g., 2.5" className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700">Distance to Buyer (km)</label>
                  <input name="price-distance" type="number" min="0" required placeholder="e.g., 50" className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-700">Moisture Content (%)</label>
                  <input name="price-moisture" type="number" min="0" max="100" required placeholder="e.g., 12" className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-emerald-700">Market Demand</label>
                  <select name="price-demand" required className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2">
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>

              <div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 text-white shadow-md flex items-center justify-center gap-2"
                  type="submit"
                  disabled={priceLoading}
                >
                  {priceLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <span>Calculate Fair Price</span>
                  )}
                </motion.button>
              </div>
            </form>

            {/* Result */}
            {priceVisible && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-emerald-700">💰 Predicted Price</div>
                    <div className="text-2xl font-extrabold text-emerald-900 mt-1">{priceData.perTonneRange}</div>
                    <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">Per Tonne Price Range</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Total Revenue</div>
                    <div className="font-semibold text-emerald-800">{priceData.totalRevenue}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Logistics Cost</div>
                    <div className="font-semibold text-emerald-800">{priceData.logistics}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Platform Fee (3%)</div>
                    <div className="font-semibold text-emerald-800">{priceData.platform}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Your Final Payout</div>
                    <div className="font-semibold text-emerald-800">{priceData.payout}</div>
                  </div>
                </div>

              </motion.div>
            )}
          </motion.section>

          {/* Yield Card */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="relative bg-white/70 backdrop-blur-md border border-emerald-200 rounded-2xl p-6 shadow-lg overflow-hidden"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-emerald-400" />

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl bg-gradient-to-br from-emerald-600 to-emerald-400">🌱</div>
              <h2 className="text-xl font-semibold text-emerald-800">Yield Estimator</h2>
            </div>

            <form onSubmit={handleYieldSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-emerald-700">Crop Type</label>
                <select name="yield-crop" required className="mt-2 w-full rounded-xl border border-emerald-200 bg-white/80 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200">
                  <option value="">Select Crop</option>
                  <option value="paddy">Paddy (Rice)</option>
                  <option value="wheat">Wheat</option>
                  <option value="maize">Maize</option>
                  <option value="sugarcane">Sugarcane</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-700">Farm Area (acres)</label>
                  <input name="yield-area" type="number" step="0.1" min="0.1" required placeholder="e.g., 5" className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700">Season</label>
                  <select name="yield-season" required className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2">
                    <option value="">Select Season</option>
                    <option value="kharif">Kharif (Monsoon)</option>
                    <option value="rabi">Rabi (Winter)</option>
                    <option value="zaid">Zaid (Summer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-emerald-700">Soil Quality</label>
                  <select name="yield-soil" required className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2">
                    <option value="">Select Quality</option>
                    <option value="poor">Poor</option>
                    <option value="average">Average</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-emerald-700">Irrigation</label>
                  <select name="yield-irrigation" required className="mt-2 w-full rounded-xl border border-emerald-200 px-3 py-2">
                    <option value="">Select Type</option>
                    <option value="rainfed">Rainfed</option>
                    <option value="canal">Canal</option>
                    <option value="tubewell">Tubewell</option>
                    <option value="drip">Drip</option>
                  </select>
                </div>
              </div>

              <div>
                <motion.button whileTap={{ scale: 0.98 }} className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-emerald-600 to-emerald-400 text-white shadow-md flex items-center justify-center gap-2" type="submit" disabled={yieldLoading}>
                  {yieldLoading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                      </svg>
                      <span>Calculating...</span>
                    </>
                  ) : (
                    <span>Estimate Parali Yield</span>
                  )}
                </motion.button>
              </div>
            </form>

            {yieldVisible && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="mt-6 p-4 rounded-lg bg-gradient-to-br from-emerald-50 to-white border border-emerald-100">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-emerald-700">📊 Estimated Yield</div>
                    <div className="text-2xl font-extrabold text-emerald-900 mt-1">{yieldData.parali}</div>
                    <div className="inline-block mt-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">Crop Residue (Parali)</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Crop Yield</div>
                    <div className="font-semibold text-emerald-800">{yieldData.cropYield}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Residue Ratio</div>
                    <div className="font-semibold text-emerald-800">{yieldData.ratio}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Potential Revenue</div>
                    <div className="font-semibold text-emerald-800">{yieldData.revenue}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-white/70 border border-emerald-100">
                    <div className="text-xs text-emerald-600">Per Acre Yield</div>
                    <div className="font-semibold text-emerald-800">{yieldData.perAcre}</div>
                  </div>
                </div>

              </motion.div>
            )}
          </motion.section>
        </main>

        <footer className="mt-8 text-center text-xs text-emerald-700">Tip: Use accurate moisture and distance values for better price estimates.</footer>
      </div>
    </div>
  );
}
