import { useEffect, useState } from "react";
import DashBoard from "../../components/DashBoard";
import api from "../../api/authApi";

export default function FarmerDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await api.get("/api/auth/me");
        setUserData(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
        <div className="text-2xl font-bold text-green-700">Loading...</div>
      </div>
    );
  }

  return (
    <DashBoard
      userName={userData?.fullName || "Farmer"}
      sidebarLinks={[
        { name: "Dashboard", path: "/farmer/dashboard", icon: "📊" },
        { name: "List Goods", path: "/farmer/listParali", icon: "📦" },
        { name: "AI Price Predictor", path: "/farmer/pricePredictor", icon: "💰" },
        { name: "Parali Classifier", path: "/farmer/paraliClassifier", icon: "🔍" },
      ]}
      summaryCards={[
        { title: "Active Deliveries", value: 3 },
        { title: "Total Weight Supplied", value: "3200 kg" },
        { title: "Revenue", value: "₹9,600" },
        { title: "Pollution Prevented", value: "1.2T CO₂" }
      ]}
      ordersData={[
        { id: 1, crop: "Paddy Straw", qty: 1200, price: 8, status: "Ordered", date: "2025-10-25" },
        { id: 2, crop: "Wheat Straw", qty: 1000, price: 7, status: "In Transit", date: "2025-10-22" },
        { id: 3, crop: "Sugarcane Trash", qty: 1000, price: 10, status: "Delivered", date: "2025-10-18" },
      ]}
    />
  );
}

