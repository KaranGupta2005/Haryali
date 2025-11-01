"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import api from "../api/authApi";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

function SummaryCard({ title, value }) {
  return (
    <div className="bg-gradient-to-br from-green-200 via-lime-100 to-white rounded-2xl shadow-xl border border-green-100 p-7 flex flex-col items-center justify-center hover:scale-[1.025] transition transform">
      <p className="text-gray-600 text-base tracking-tight mt-2">{title}</p>
      <p className="text-2xl font-extrabold text-green-700 mt-1">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    Ordered: "bg-yellow-300 text-yellow-900 shadow",
    "In Transit": "bg-blue-300 text-blue-900 shadow",
    Delivered: "bg-green-300 text-green-900 shadow",
    Active: "bg-emerald-200 text-emerald-800 shadow",
  };
  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-bold select-none ${
        colors[status] || "bg-gray-200 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function DashBoard({
  sidebarLinks = [],
  brand = "Haryali",
  pageTitle = "Dashboard",
}) {
  const [userName, setUserName] = useState("User");
  const [ordersData, setOrdersData] = useState([]);
  const [residuesData, setResiduesData] = useState([]);
  const [summaryCards, setSummaryCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUserName(res.data.user?.fullName || "Farmer");
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/parali");
        const listings = res.data.listings || [];

        const orders = listings.map((item, index) => ({
          id: index + 1,
          crop: item.cropType,
          qty: item.quantity * 1000, // converting tons → kg
          price: item.estimatedPrice || 8,
          status: "Active",
          date: new Date(item.createdAt).toLocaleDateString(),
        }));

        const marketplace = listings.map((item, index) => ({
          id: index + 1,
          biomassType: item.cropType,
          quantityKg: item.quantity * 1000,
          predictedPricePerKg: item.estimatedPrice || 8,
          farmer: item.farmerName,
          location: item.location,
          priceType: "Fixed",
        }));

        setOrdersData(orders);
        setResiduesData(marketplace);

        const totalQty = listings.reduce(
          (sum, l) => sum + Number(l.quantity || 0),
          0
        );
        const revenue = listings.reduce(
          (sum, l) =>
            sum + Number(l.quantity || 0) * (l.estimatedPrice || 8) * 1000,
          0
        );

        setSummaryCards([
          { title: "Active Listings", value: listings.length },
          { title: "Total Quantity", value: `${totalQty} tons` },
          { title: "Estimated Revenue", value: `₹${revenue.toLocaleString()}` },
          { title: "Pollution Prevented", value: `${(totalQty * 0.4).toFixed(1)}T CO₂` },
        ]);
      } catch (err) {
        console.error("Error fetching listings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const COLORS = ["#facc15", "#3b82f6", "#22c55e"];
  const completedOrders = ordersData.filter(
    (o) => o.status === "Delivered"
  ).length;
  const statusData = [
    { name: "Active", value: ordersData.length },
    { name: "Delivered", value: completedOrders },
  ];
  const monthlyData = [
    { month: "May", qty: 800 },
    { month: "Jun", qty: 1200 },
    { month: "Jul", qty: 1000 },
    { month: "Aug", qty: ordersData.length * 500 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
        <div className="text-2xl font-bold text-green-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-tr from-green-100 via-white to-lime-50">
      <Sidebar links={sidebarLinks} brand={brand} />
      <main className="flex-1 p-8 md:p-14 overflow-auto">
        <h1 className="text-5xl font-extrabold text-green-800 mb-9 drop-shadow-lg">
          Welcome, {userName} <span className="animate-wave">👋</span>
        </h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {summaryCards.map((c) => (
            <SummaryCard key={c.title} {...c} />
          ))}
        </div>

        {/* Graphs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-7">
            <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-1">
              📈 Monthly Procurement Trend
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="qty"
                  stroke="#16a34a"
                  strokeWidth={3}
                  dot={{ r: 5, stroke: "#84cc16", strokeWidth: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-7">
            <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
              🪢 Order Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name }) => name}
                >
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

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-7 overflow-x-auto">
          <h2 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
            📋 Recent Orders
          </h2>
          <table className="w-full border-collapse text-left rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-green-100 text-green-700 font-semibold text-base">
                <th className="py-2 px-4">Crop</th>
                <th className="py-2 px-4">Quantity</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Total</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((o) => (
                <tr
                  key={o.id}
                  className="border-b last:border-none hover:bg-green-50 transition"
                >
                  <td className="py-2 px-4">{o.crop}</td>
                  <td className="py-2 px-4">{o.qty} kg</td>
                  <td className="py-2 px-4">₹{o.price}/kg</td>
                  <td className="py-2 px-4">
                    ₹{(o.qty * o.price).toFixed(0)}
                  </td>
                  <td className="py-2 px-4">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-2 px-4">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Haryali Marketplace */}
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold text-green-700 mb-4 flex items-center gap-2">
            🌱 Haryali Marketplace
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {residuesData.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg border border-lime-100 p-7 flex flex-col justify-between hover:scale-[1.03] hover:shadow-xl transition"
              >
                <div>
                  <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                    {item.biomassType}{" "}
                    <span className="text-sm text-gray-400">#{item.id}</span>
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {item.quantityKg} kg • {item.location}
                  </p>
                  <p className="text-green-700 font-extrabold mt-2 text-lg">
                    ₹{item.predictedPricePerKg.toFixed(2)}/kg
                  </p>
                  <p className="text-sm text-gray-500">
                    Farmer: {item.farmer}
                  </p>
                  <span
                    className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-bold shadow-sm ${
                      item.priceType === "Fixed"
                        ? "bg-blue-200 text-blue-900"
                        : "bg-purple-200 text-purple-900"
                    }`}
                  >
                    {item.priceType}
                  </span>
                </div>
                <button className="mt-6 bg-gradient-to-r from-green-600 to-lime-500 hover:from-lime-600 hover:to-green-700 text-white rounded-xl py-2 font-bold transition shadow hover:scale-[1.05]">
                  {item.priceType === "Auction" ? "Place Bid" : "Order Now"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .animate-wave {
            animation: wave 1.8s infinite;
            display: inline-block;
          }
          @keyframes wave {
            0% { transform: rotate(0deg); }
            10% { transform: rotate(22deg); }
            20% { transform: rotate(-12deg); }
            30% { transform: rotate(20deg); }
            40%,100% { transform: rotate(0deg); }
          }
        `}</style>
      </main>
    </div>
  );
}

