import DashBoard from "@/components/DashBoard";

export default function BuyerDashboard() {
  return (
    <DashBoard
      userName="Buyer Priya"
      sidebarLinks={[
        { name: "Dashboard", path: "/buyer/dashboard"},
        { name: "My Orders", path: "/buyer/orders"},
        { name: "Marketplace", path: "/buyer/market" }
      ]}
      summaryCards={[
        { title: "Orders in Progress", value: 2},
        { title: "Orders Completed", value: 5},
        { title: "Purchased Biomass", value: "3800 kg"},
        { title: "Total Spend", value: "₹13,500"}
      ]}
    />
  );
}
