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
import BuyerMarket from "./features/buyer/Marketplace.jsx";
import LogisticsDashboard from "./features/logistics/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ChatBot from "./components/chatBot.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden scroll-smooth bg-gradient-to-tr from-green-50 via-white to-lime-50">
        <Navbar />

        {/* Main content */}
        <main className="flex-1 mt-24">
          <Routes>
            {/* Public Pages */}
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
                  <div className="min-h-screen flex items-center justify-center text-center">
                    <h1 className="text-4xl font-extrabold text-green-700">
                      🧾 My Orders — Coming Soon
                    </h1>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/buyer/market"
              element={
                <ProtectedRoute allowedRoles={["buyer"]}>
                  <BuyerMarket />
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
                  <div className="min-h-screen flex items-center justify-center text-center">
                    <h1 className="text-4xl font-extrabold text-green-700">
                      🗺️ Routes — Coming Soon
                    </h1>
                  </div>
                </ProtectedRoute>
              }
            />
            <Route
              path="/logistics/shipments"
              element={
                <ProtectedRoute allowedRoles={["logistics"]}>
                  <div className="min-h-screen flex items-center justify-center text-center">
                    <h1 className="text-4xl font-extrabold text-green-700">
                      🚛 All Shipments — Coming Soon
                    </h1>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* 404 Fallback */}
            <Route
              path="*"
              element={
                <div className="min-h-screen flex flex-col items-center justify-center text-center">
                  <h1 className="text-5xl font-extrabold text-green-700 mb-4">
                    404 - Page Not Found
                  </h1>
                  <p className="text-lg text-gray-600">
                    Oops! The page you’re looking for doesn’t exist.
                  </p>
                </div>
              }
            />
          </Routes>
        </main>

        {/* Chatbot */}
        <ChatBot className="fixed bottom-6 right-6 z-50" />

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
