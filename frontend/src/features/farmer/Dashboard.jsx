import DashBoard from "@/components/DashBoard";

export default function FarmerDashboard() {
  return (
    <DashBoard
      userName="Farmer Aman"
      sidebarLinks={[
        { name: "Dashboard", path: "/farmer/dashboard" },
        { name: "List Goods", path: "/farmer/goods" },
        { name: "AI Price Predictor", path: "/farmer/pricePredictor" },
        { name: "Parali Classifier", path: "/farmer/paraliClassifier" },
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
