"use client";
import { useState } from "react";
import { motion } from "motion/react";
import axios from "axios";
import Sidebar from "@/components/Sidebar";

export default function ListParali() {
  const [formData, setFormData] = useState({
    farmerName: "",
    location: "",
    cropType: "",
    quantity: "",
    contact: "",
    proposedPrice: "",
    predictedPrice: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

 const sidebarLinks = [
          { name: "Dashboard", path: "/farmer/dashboard" },
          { name: "List Goods", path: "/farmer/listParali" },
          { name: "AI Price Predictor", path: "/farmer/pricePredictor" },
          { name: "Parali Classifier", path: "/farmer/paraliClassifier" },
        ];

  // Generate predicted price (±10% random fluctuation)
  const generatePredictedPrice = (price) => {
    const fluctuation = (Math.random() * 0.2 - 0.1) * price;
    return Math.max(0, parseFloat(price) + fluctuation).toFixed(2);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    if (name === "proposedPrice" && value) {
      updated.predictedPrice = generatePredictedPrice(value);
    }

    setFormData(updated);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      quantity: Number(formData.quantity),
      proposedPrice: Number(formData.proposedPrice),
      predictedPrice: Number(formData.predictedPrice),
    };

    const { farmerName, location, cropType, quantity, contact, proposedPrice } = payload;

    if (!farmerName || !location || !cropType || !quantity || !contact || !proposedPrice) {
      alert("⚠️ Please fill all fields before submitting.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/parali", payload);
      console.log("✅ Listing added:", res.data);
      setSubmitted(true);

      setFormData({
        farmerName: "",
        location: "",
        cropType: "",
        quantity: "",
        contact: "",
        proposedPrice: "",
        predictedPrice: "",
      });
    } catch (err) {
      console.error("❌ Error creating listing:", err.response?.data || err);
      alert(
        err.response?.data?.errors?.join("\n") ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Sidebar on the left */}
      <Sidebar links={sidebarLinks} brand="Farmer Portal" />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <motion.div
          className="bg-white shadow-xl rounded-2xl w-full max-w-lg p-8 border border-green-200"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
            Parali Listing Form
          </h1>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Farmer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Farmer Name
                </label>
                <input
                  type="text"
                  name="farmerName"
                  value={formData.farmerName}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  placeholder="Enter village or district"
                />
              </div>

              {/* Parali Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Parali Type
                </label>
                <select
                  name="cropType"
                  value={formData.cropType}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                >
                  <option value="">Select type</option>
                  <option value="Standing Stubble">Standing Stubble</option>
                  <option value="Loose Straw">Loose Straw</option>
                </select>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity (in tons)
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Proposed Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Proposed Price (₹ per ton)
                </label>
                <input
                  type="number"
                  name="proposedPrice"
                  value={formData.proposedPrice}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-xl p-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                  placeholder="Enter your asking price"
                />
              </div>

              {/* Predicted Price Display */}
              {formData.predictedPrice && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-2 bg-green-50 border border-green-300 rounded-xl p-3 text-center text-green-800 font-semibold"
                >
                  🌾 Predicted Fair Price: ₹{formData.predictedPrice} / ton
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-2 rounded-xl hover:bg-green-700 transition flex justify-center items-center mt-4"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin text-white mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Listing"
                )}
              </motion.button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-xl font-semibold text-green-700 mb-2">
                ✅ Listing Submitted Successfully!
              </h2>
              <p className="text-gray-600 mb-4">
                Thank you, {formData.farmerName || "Farmer"}. Your Parali listing has been saved.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSubmitted(false)}
                className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
              >
                Add Another Listing
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}
