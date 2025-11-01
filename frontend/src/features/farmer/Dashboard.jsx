import { useEffect, useState } from "react";
import DashBoard from "../../components/DashBoard";
import api from "../../api/authApi";
import axios from "axios";

export default function FarmerDashboard() {
  const [userData, setUserData] = useState(null);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fetch logged-in user
  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUserData(res.data.user);
    } catch (err) {
      console.error("Failed to fetch user data:", err);
      setError("Unable to load user details.");
    }
  };

  // ✅ Fetch parali listings from backend
  const fetchListings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/parali");
      setListings(res.data.listings || []);
    } catch (err) {
      console.error("Failed to fetch listings:", err);
      setError("Unable to load parali listings.");
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([fetchUserData(), fetchListings()]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-2xl font-bold text-green-700">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-red-700 font-semibold">
        {error}
      </div>
    );

  const role = userData?.role?.toLowerCase() || "farmer";
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

  const summaryCards = [
    { title: "Active Listings", value: listings.length },
    {
      title: "Total Quantity Listed",
      value:
        listings.reduce((sum, item) => sum + Number(item.quantity || 0), 0) +
        " tons",
    },
    { title: "Revenue (Est.)", value: "₹" + listings.length * 5000 },
    {
      title: "Pollution Prevented",
      value: `${(listings.length * 0.3).toFixed(1)}T CO₂`,
    },
  ];

  const ordersData = listings.map((listing, index) => ({
    id: index + 1,
    crop: listing.cropType,
    qty: listing.quantity,
    proposedPrice: listing.proposedPrice || "—",
    predictedPrice: listing.predictedPrice || "—",
    status: listing.status || "Active",
    date: new Date(listing.createdAt).toLocaleDateString(),
  }));

  const residuesData = listings.map((item, index) => ({
    id: index + 1,
    biomassType: item.cropType,
    quantityKg: item.quantity * 1000,
    proposedPrice: item.proposedPrice || "—",
    predictedPrice: item.predictedPrice || "—",
    farmer: item.farmerName,
    location: item.location,
    priceType: "Fixed",
  }));

  return (
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
      }))}
    />
  );
}

