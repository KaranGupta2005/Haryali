// src/pages/buyer/dashboard/BuyerDashboard.jsx
"use client";

import { useEffect, useState } from "react";
import DashBoard from "../../components/DashBoard";
import api from "../../api/authApi";
import axios from "axios";

export default function BuyerDashboard() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [marketplace, setMarketplace] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  const API = axios.create({
    baseURL: "http://localhost:5000",
  });

  // ✅ Fetch logged-in user
  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUserData(res.data.user);
    } catch (err) {
      console.error("❌ Failed to fetch user data:", err);
      setError("Unable to load user details.");
    }
  };

  // ✅ Fetch buyer orders
  const fetchBuyerOrders = async (email) => {
    try {
      const res = await API.get(`/api/buyer?email=${email}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("❌ Failed to fetch buyer orders:", err);
      setError("Unable to load orders.");
    }
  };

  // ✅ Fetch marketplace listings
  const fetchMarketplace = async () => {
    try {
      const res = await API.get("/api/marketplace");
      setMarketplace(res.data.marketplace || []);
    } catch (err) {
      console.error("❌ Failed to fetch marketplace:", err);
      setError("Unable to load marketplace data.");
    }
  };

  // ✅ Fetch user first
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchUserData();
      setLoading(false);
    };
    init();
  }, []);

  // ✅ Fetch orders + marketplace after user loads
  useEffect(() => {
    if (userData?.email) {
      fetchBuyerOrders(userData.email);
      fetchMarketplace();
    }
  }, [userData]);

  // ✅ Toast handlers
  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  // ✅ Unified action handler
  const handleAction = async (item) => {
    const role = (userData?.role || "").toLowerCase();

    try {
      // Buyer → Order Now
      if (role === "buyer") {
        await API.post("/api/orders", {
          buyerName: userData.fullName,
          listingId: item.id,
          cropType: item.biomassType,
          quantity: Number(item.quantityKg / 1000),
          price: Number(item.predictedPrice || item.proposedPrice || 0),
        });
        showSuccess("Order placed successfully!");
      }

      // Logistics → Complete order
      else if (role === "logistics") {
        await API.patch(`/api/orders/${item.id}/complete`);
        showSuccess("Order marked as completed!");
      }

      // Farmer → Place bid (unlikely here but kept for reuse)
      else if (role === "farmer") {
        await API.post("/api/marketplace", {
          listingId: item.id,
          farmerName: userData.fullName,
          cropType: item.biomassType,
          quantity: Number(item.quantityKg / 1000),
          proposedPrice: Number(item.proposedPrice || 0),
          predictedPrice: Number(item.predictedPrice || 0),
        });
        showSuccess("Bid placed successfully!");
      }

      // Refresh data after action
      await Promise.all([fetchBuyerOrders(userData.email), fetchMarketplace()]);
    } catch (err) {
      console.error("❌ Action failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.join?.("\n") ||
        "Action failed. Please try again.";
      showError(msg);
    }
  };

  // ✅ Show loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-2xl font-bold text-green-700">Loading...</div>
      </div>
    );
  }

  // ✅ Dashboard metrics
  const totalPurchased = orders.reduce((sum, o) => sum + (o.quantity || 0), 0);
  const totalSpend = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const summaryCards = [
    { title: "Orders in Progress", value: orders.filter((o) => o.status !== "Delivered").length },
    { title: "Orders Completed", value: orders.filter((o) => o.status === "Delivered").length },
    { title: "Purchased Biomass", value: `${totalPurchased.toFixed(2)} tons` },
    { title: "Total Spend", value: `₹${totalSpend.toLocaleString()}` },
  ];

  const ordersData = orders.map((order, i) => ({
    id: order._id || i + 1,
    crop: order.cropType,
    qty: Number(order.quantity || 0) * 1000,
    price: `₹${order.price}`,
    status: order.status || "Pending",
    date: new Date(order.createdAt || Date.now()).toLocaleDateString(),
  }));

  const residuesData = marketplace.map((item, i) => ({
    id: item._id || i + 1,
    biomassType: item.cropType,
    quantityKg: Number(item.quantity || 0) * 1000,
    proposedPrice: item.proposedPrice || "—",
    predictedPrice: item.predictedPrice || "—",
    farmer: item.farmerName || "—",
    location: item.location || "—",
    priceType: item.priceType || "Fixed",
    actionText: "Order Now",
    _raw: item,
  }));

  // ✅ Render UI
  return (
    <>
      {/* ✅ Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-2">
        {successMessage && (
          <div className="bg-green-600 text-white px-5 py-2 rounded-lg shadow">
            {successMessage}
          </div>
        )}
        {error && (
          <div className="bg-red-600 text-white px-5 py-2 rounded-lg shadow">
            {error}
          </div>
        )}
      </div>

      <DashBoard
        userName={userData?.fullName || "Buyer"}
        sidebarLinks={[
          { name: "Dashboard", path: "/buyer/dashboard" },
          { name: "My Orders", path: "/buyer/orders" },
          { name: "Marketplace", path: "/buyer/market" },
        ]}
        summaryCards={summaryCards}
        ordersData={ordersData}
        residuesData={residuesData}
        onResidueAction={(residue) => handleAction(residue._raw)}
      />
    </>
  );
}
