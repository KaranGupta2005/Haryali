import { useEffect, useState } from "react";
import DashBoard from "@/components/DashBoard";
import api from "@/api/authApi";

export default function LogisticsDashboard() {
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
      userName={userData?.fullName || "Logistics"}
      sidebarLinks={[
        { name: "Dashboard", path: "/logistics/dashboard", icon: "📊" },
        { name: "Routes", path: "/logistics/routes", icon: "🗺️" },
        { name: "All Shipments", path: "/logistics/shipments", icon: "🚚" }
      ]}
      summaryCards={[
        { title: "Deliveries in Transit", value: 4 },
        { title: "Completed Trips", value: 21 },
        { title: "Tonnage Shipped", value: "18T" },
        { title: "CO₂ Saved", value: "2.4T" }
      ]}
      ordersData={[
        { id: 1, crop: "Paddy Straw", qty: 1200, price: 8, status: "In Transit", date: "2025-10-24" },
        { id: 2, crop: "Wheat Straw", qty: 800, price: 7, status: "In Transit", date: "2025-10-23" },
        { id: 3, crop: "Cotton Stalks", qty: 1500, price: 9, status: "Delivered", date: "2025-10-20" },
      ]}
    />
  );
}