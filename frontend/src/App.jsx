import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Features from "./pages/Features.jsx";
import FarmerDashboard from "./features/farmer/Dashboard.jsx";
import PricePredictor from "./features/farmer/pricePredictor.jsx";
import ParaliClassifier from "./features/farmer/paraliClassifier.jsx";
import BuyerDashboard from "./features/buyer/Dashboard.jsx";
import LogisticsDashboard from "./features/logistics/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import DashBoard from "./components/DashBoard.jsx";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen w-full overflow-x-hidden scroll-smooth">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 mt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/features" element={<Features />} />
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
            <Route path="/farmer/pricePredictor" element={<PricePredictor />} />
            <Route path="/farmer/paraliClassifier" element={<ParaliClassifier />} />
            <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
            <Route path="/logistics/dashboard" element={<LogisticsDashboard />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
