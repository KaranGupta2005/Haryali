"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../../api/authApi";
import { motion, AnimatePresence } from "framer-motion";

export default function BuyerMarket() {
  const [listings, setListings] = useState([]);
  const [buyer, setBuyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // ✅ Fetch buyer info
  const fetchBuyer = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setBuyer(res.data.user);
    } catch (err) {
      console.error("Failed to fetch buyer:", err);
    }
  };

  // ✅ Fetch all active parali listings
  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/parali");
      setListings(res.data.listings || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create a new order
  const handleOrder = async (listing) => {
    try {
      await axios.post("http://localhost:5000/api/buyer", {
        buyerName: buyer?.fullName,
        buyerEmail: buyer?.email,
        listingId: listing._id,
        cropType: listing.cropType,
        quantity: listing.quantity,
        price: listing.predictedPrice,
      });
      setSuccessMessage("✅ Order placed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Order placement failed:", err);
      setSuccessMessage("❌ Failed to place order.");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  useEffect(() => {
    fetchBuyer();
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-2xl font-bold text-green-700">Loading Marketplace...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 via-white to-lime-50 p-8 md:p-14">
      {/* ✅ Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50 font-semibold"
          >
            {successMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <h1 className="text-4xl font-extrabold text-green-800 mb-10">
        🌿 Haryali Marketplace
      </h1>

      {listings.length === 0 ? (
        <div className="text-center text-gray-600 text-lg mt-10">
          No active listings available.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((item) => (
            <motion.div
              key={item._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white border border-lime-100 rounded-2xl shadow-lg p-6 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-bold text-green-700 flex items-center gap-2">
                  {item.cropType}
                  <span className="text-sm text-gray-400">#{item._id.slice(-5)}</span>
                </h2>

                <p className="text-sm text-gray-600 mt-1">
                  <strong>Quantity:</strong> {item.quantity} tons
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Location:</strong> {item.location || "N/A"}
                </p>

                <div className="mt-3 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-800">
                      Proposed Price:
                    </span>{" "}
                    ₹{item.proposedPrice}/ton
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-green-800">
                      Predicted Price:
                    </span>{" "}
                    ₹{item.predictedPrice}/ton
                  </p>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  <strong>Farmer:</strong> {item.farmerName || "Unknown"}
                </p>
              </div>

              <button
                onClick={() => handleOrder(item)}
                className="mt-6 bg-gradient-to-r from-green-600 to-lime-500 hover:from-lime-700 hover:to-green-700 text-white rounded-xl py-2 font-bold shadow transition"
              >
                🛒 Order Now
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
