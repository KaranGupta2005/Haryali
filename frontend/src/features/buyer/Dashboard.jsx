import { useEffect, useState } from "react";
import DashBoard from "@/components/DashBoard";
import api from "@/api/authApi";

export default function BuyerDashboard() {
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
      userName={userData?.fullName || "Buyer"}
      sidebarLinks={[
        { name: "Dashboard", path: "/buyer/dashboard", icon: "📊" },
        { name: "My Orders", path: "/buyer/orders", icon: "📦" },
        { name: "Marketplace", path: "/buyer/market", icon: "🛒" }
      ]}
      summaryCards={[
        { title: "Orders in Progress", value: 2},
        { title: "Orders Completed", value: 5},
        { title: "Purchased Biomass", value: "3,800 kg"},
        { title: "Total Spend", value: "₹13,500"}
      ]}
      ordersData={[
        { id: 1, crop: "Paddy Straw", qty: 800, price: 30, status: "Ordered", date: "2025-10-23" },
        { id: 2, crop: "Rice Husk", qty: 1600, price: 24, status: "In Transit", date: "2025-10-20" },
        { id: 3, crop: "Sugarcane Bagasse", qty: 1400, price: 38, status: "Delivered", date: "2025-10-15" },
      ]}
    />
  );
}