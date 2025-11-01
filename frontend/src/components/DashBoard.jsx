"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "../api/authApi";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function DashBoard({
  sidebarLinks = [],
  brand = "Haryali",
  userName = "User",
  userRole = "Farmer",
  summaryCards = [],
  ordersData = [],
  residuesData = [],
}) {
  const [successMessage, setSuccessMessage] = useState("");

  const handleActionClick = async (action, item) => {
    try {
      if (userRole === "Buyer" && action === "Order Now") {
        await axios.post("http://localhost:5000/api/buyer", {
          buyerName: userName,
          listingId: item.id,
          cropType: item.biomassType,
          quantity: item.quantityKg / 1000,
          price: item.predictedPrice,
        });
      } else if (userRole === "Farmer" && action === "Place Bid") {
        await axios.put(`http://localhost:5000/api/parali/${item.id}/list`);
      } else if (userRole === "Logistics" && action === "Complete Order") {
        await axios.put(`http://localhost:5000/api/buyer/${item.id}/status`, {
          status: "Delivered",
        });
      }
      setSuccessMessage(`✅ ${action} Successful!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(`${action} failed:`, err);
    }
  };

  const COLORS = ["#facc15", "#3b82f6", "#22c55e"];
  const completedOrders = ordersData.filter((o) => o.status === "Delivered").length;
  const statusData = [
    { name: "Active", value: ordersData.length - completedOrders },
    { name: "Delivered", value: completedOrders },
  ];
  const monthlyData = [
    { month: "May", qty: 800 },
    { month: "Jun", qty: 1200 },
    { month: "Jul", qty: 1000 },
    { month: "Aug", qty: ordersData.length * 500 },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-green-100 via-white to-lime-50">
      <Sidebar links={sidebarLinks} brand={brand} />
      <main className="flex-1 p-8 md:p-14 overflow-auto relative">
        {/* ✅ Success Popup */}
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

        <h1 className="text-5xl font-extrabold text-green-800 mb-9 drop-shadow-lg">
          Welcome, {userName} <span className="animate-wave">👋</span>
        </h1>

        {/* ✅ Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {summaryCards.map((c) => (
            <div key={c.title} className="bg-gradient-to-br from-green-200 via-lime-100 to-white rounded-2xl shadow-xl border border-green-100 p-7 flex flex-col items-center justify-center">
              <p className="text-gray-600 text-base tracking-tight mt-2">{c.title}</p>
              <p className="text-2xl font-extrabold text-green-700 mt-1">{c.value}</p>
            </div>
          ))}
        </div>

        {/* ✅ Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-7">
            <h2 className="text-lg font-bold text-green-700 mb-4">📈 Monthly Procurement Trend</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="qty" stroke="#16a34a" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-7">
            <h2 className="text-lg font-bold text-green-700 mb-4">🪢 Order Status Distribution</h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} dataKey="value" cx="50%" cy="50%" outerRadius={80} label={({ name }) => name}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ✅ Marketplace */}
        {residuesData.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-extrabold text-green-700 mb-4">🌱 Haryali Marketplace</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {residuesData.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg border border-lime-100 p-7 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700">{item.biomassType}</h3>
                    <p className="text-gray-600 text-sm">{item.quantityKg} kg • {item.location}</p>
                  </div>
                  <button
                    onClick={() =>
                      handleActionClick(
                        userRole === "Buyer"
                          ? "Order Now"
                          : userRole === "Logistics"
                          ? "Complete Order"
                          : "Place Bid",
                        item
                      )
                    }
                    className="mt-6 bg-gradient-to-r from-green-600 to-lime-500 hover:scale-105 text-white rounded-xl py-2 font-bold transition"
                  >
                    {userRole === "Buyer"
                      ? "Order Now"
                      : userRole === "Logistics"
                      ? "Complete Order"
                      : "Place Bid"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
