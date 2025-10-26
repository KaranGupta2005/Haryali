import DashBoard from "@/components/DashBoard";

export default function FarmerDashboard() {
  return (
    <DashBoard
      userName="Farmer Aman"
      sidebarLinks={[
        { name: "Dashboard", path: "/farmer/dashboard" },
        { name: "My Goods", path: "/farmer/goods" },
        { name: "Add Biomass", path: "/farmer/add-biomass" }
      ]}
      summaryCards={[
        { title: "Active Deliveries", value: 3 },
        { title: "Total Weight Supplied", value: "3200 kg" },
        { title: "Revenue", value: "₹9600" },
        { title: "Pollution Prevented", value: "1.2T CO₂" }
      ]}
    />
  );
}
