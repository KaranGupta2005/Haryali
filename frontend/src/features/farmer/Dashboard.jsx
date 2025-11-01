"use client";

import { useEffect, useState } from "react";
import DashBoard from "../../components/DashBoard";
import api from "../../api/authApi";
import axios from "axios";

export default function FarmerDashboard() {
  const [userData, setUserData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const API = axios.create({
    baseURL: "http://localhost:5000",
  });

  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUserData(res.data.user);
    } catch (err) {
      console.error("❌ Failed to fetch user data:", err);
      setError("Unable to load user details.");
    }
  };

  const fetchListings = async () => {
    if (!userData?.email) return;
    try {
      const res = await API.get(`/api/parali?farmerEmail=${userData.email}`);
      const data = res.data.listings || [];
      setListings(data);
    } catch (err) {
      console.error("❌ Failed to fetch listings:", err);
      setError("Unable to load parali listings.");
    }
  };

  useEffect(() => {
    if (userData) fetchListings();
  }, [userData]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setError(null);
      await fetchUserData();
      setLoading(false);
    };
    init();
  }, []);

  const showSuccess = (msg) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(""), 3000);
  };
  const showError = (msg) => {
    setError(msg);
    setTimeout(() => setError(""), 4000);
  };

  const role = (userData?.role || "farmer").toLowerCase();

  const getActionText = () => {
    switch (role) {
      case "buyer":
        return "Order Now";
      case "logistics":
        return "Complete Now";
      default:
        return "Place Bid";
    }
  };

  const handleAction = async (item) => {
    try {
      if (role === "farmer") {
        await API.post("/api/marketplace", {
          listingId: item.id,
          farmerName: userData?.fullName,
          cropType: item.biomassType,
          quantity: Number((item.quantityKg || 0) / 1000),
          proposedPrice: Number(item.proposedPrice || 0),
          predictedPrice: Number(item.predictedPrice || 0),
        });
        showSuccess("Bid placed on marketplace successfully!");
      } else if (role === "buyer") {
        await API.post("/api/orders", {
          buyerName: userData?.fullName,
          listingId: item.id,
          cropType: item.biomassType,
          quantity: Number((item.quantityKg || 0) / 1000),
          price: Number(item.predictedPrice || item.proposedPrice || 0),
        });
        showSuccess("Order placed successfully!");
      } else if (role === "logistics") {
        await API.patch(`/api/parali/${item.id}/complete`);
        showSuccess("Order marked completed!");
      }
    } catch (err) {
      console.error("❌ Action failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.join?.("\n") ||
        "Action failed. Please check console.";
      showError(msg);
    }
  };

  const totalQty = listings.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const estRevenue = listings.reduce(
    (sum, item) => sum + (Number(item.predictedPrice || 0) * Number(item.quantity || 0)),
    0
  );

  const summaryCards = [
    { title: "Active Listings", value: listings.length },
    { title: "Total Quantity Listed", value: `${totalQty.toFixed(2)} tons` },
    { title: "Estimated Revenue", value: `₹${estRevenue.toLocaleString()}` },
    { title: "Pollution Prevented", value: `${(totalQty * 0.3).toFixed(1)}T CO₂` },
  ];

  const ordersData = listings.map((listing, i) => ({
    id: listing._id || i + 1,
    crop: listing.cropType,
    qty: Number(listing.quantity || 0),
    price: listing.predictedPrice ? `₹${listing.predictedPrice}/ton` : "—",
    status: listing.status || "Active",
    date: new Date(listing.createdAt || Date.now()).toLocaleDateString(),
  }));

  const residuesData = listings.map((item, i) => ({
    id: item._id || i + 1,
    biomassType: item.cropType,
    quantityKg: Number(item.quantity || 0) * 1000,
    proposedPrice: item.proposedPrice ?? "—",
    predictedPrice: item.predictedPrice ?? "—",
    farmer: item.farmerName || userData?.fullName || "Unknown",
    location: item.location || "—",
    priceType: "Fixed",
  }));

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
        <div className="text-2xl font-bold text-green-700">Loading...</div>
      </div>
    );

  return (
    <>
      {/* Toasts */}
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
        userName={userData?.fullName || "Farmer"}
        sidebarLinks={[
          { name: "Dashboard", path: "/farmer/dashboard" },
          { name: "List Goods", path: "/farmer/listParali" },
          { name: "AI Price Predictor", path: "/farmer/pricePredictor" },
          { name: "Parali Classifier", path: "/farmer/paraliClassifier" },
        ]}
        summaryCards={summaryCards}
        ordersData={ordersData}
        residuesData={residuesData.map((item) => ({
          ...item,
          actionText: getActionText(),
          _raw: item,
        }))}
        onResidueAction={(residue) => handleAction(residue._raw)}
      />
    </>
  );
}


