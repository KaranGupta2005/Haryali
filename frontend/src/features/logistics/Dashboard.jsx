import DashBoard from "@/components/DashBoard";

export default function LogisticsDashboard() {
  return (
    <DashBoard
      userName="Logistics Anil"
      sidebarLinks={[
        { name: "Dashboard", path: "/logistics/dashboard" },
        { name: "Routes", path: "/logistics/routes" },
        { name: "All Shipments", path: "/logistics/shipments" }
      ]}
      summaryCards={[
        { title: "Deliveries in Transit", value: 4 },
        { title: "Completed Trips", value: 21 },
        { title: "Tonnage Shipped", value: "18T" },
        { title: "CO₂ Saved", value: "2.4T" }
      ]}
      
    />
  );
}
