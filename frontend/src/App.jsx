import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Features from "./pages/Features.jsx";
import FarmerDashboard from "./features/farmer/Dashboard.jsx";
import PricePredictor from "./features/farmer/pricePredictor.jsx";
import ParaliClassifier from "./features/farmer/paraliClassifier.jsx";
import ListParali from "./features/farmer/ListParali.jsx";
import BuyerDashboard from "./features/buyer/Dashboard.jsx";
import LogisticsDashboard from "./features/logistics/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden scroll-smooth">
        <Navbar />

        <main className="flex-1 mt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Farmer Routes */}
            <Route
              path="/farmer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <FarmerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/pricePredictor"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <PricePredictor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/paraliClassifier"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <ParaliClassifier />
                </ProtectedRoute>
              }
            />
            <Route
              path="/farmer/listParali"
              element={
                <ProtectedRoute allowedRoles={["farmer"]}>
                  <ListParali />
                </ProtectedRoute>
              }
            />

            {/* Buyer Routes */}
            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/orders"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
                    <h1 className="text-4xl font-bold text-green-700">My Orders - Coming Soon</h1>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/market"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
                    <h1 className="text-4xl font-bold text-green-700">Marketplace - Coming Soon</h1>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Logistics Routes */}
            <Route
              path="/logistics/dashboard"
              element={
                <ProtectedRoute allowedRoles={["logistics"]}>
                  <LogisticsDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/logistics/routes"
              element={
                <ProtectedRoute allowedRoles={["logistics"]}>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
                    <h1 className="text-4xl font-bold text-green-700">Routes - Coming Soon</h1>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logistics/shipments"
              element={
                <ProtectedRoute allowedRoles={["logistics"]}>
                  <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-green-100 via-white to-lime-50">
                    <h1 className="text-4xl font-bold text-green-700">All Shipments - Coming Soon</h1>
                  </div>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
