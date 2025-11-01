import { useEffect, useState } from "react";
import DashBoard from "../../components/DashBoard";
import api from "../../api/authApi";
import axios from "axios";

export default function BuyerDashboard() {
  const [userData, setUserData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch logged-in buyer
  const fetchUserData = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setUserData(res.data.user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // ✅ Fetch buyer-specific orders from backend
  const fetchBuyerOrders = async (email) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/buyer?email=${email}`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch buyer orders:", err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchUserData();
    };
    fetchAll();
  }, []);

  useEffect(() => {
    if (userData?.email) fetchBuyerOrders(userData.email);
    setLoading(false);
  }, [userData]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-2xl font-bold text-green-700">Loading...</div>
      </div>
    );

  const summaryCards = [
    { title: "Orders in Progress", value: orders.filter(o => o.status !== "Delivered").length },
    { title: "Orders Completed", value: orders.filter(o => o.status === "Delivered").length },
    { title: "Purchased Biomass", value: `${orders.reduce((sum, o) => sum + (o.quantity || 0), 0)} tons` },
    { title: "Total Spend", value: `₹${orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)}` },
  ];

  const ordersData = orders.map((order, index) => ({
    id: order._id || index + 1,
    crop: order.cropType,
    qty: order.quantity * 1000,
    price: order.price,
    status: order.status,
    date: new Date(order.createdAt).toLocaleDateString(),
  }));

  return (
    <DashBoard
      userName={userData?.fullName || "Buyer"}
      sidebarLinks={[
        { name: "Dashboard", path: "/buyer/dashboard", icon: "📊" },
        { name: "My Orders", path: "/buyer/orders", icon: "📦" },
        { name: "Marketplace", path: "/buyer/market", icon: "🛒" },
      ]}
      summaryCards={summaryCards}
      ordersData={ordersData}
    />
  );
}
