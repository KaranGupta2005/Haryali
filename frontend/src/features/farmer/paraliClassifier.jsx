"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { MapPin, Navigation, LocateFixed } from "lucide-react";

// === Custom Basic UI Components ===
const Input = ({ value, onChange, placeholder, className = "" }) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className={`px-4 py-2 rounded-md border border-green-300 text-black focus:outline-none focus:ring-2 focus:ring-green-500 transition ${className}`}
  />
);

const Button = ({ onClick, children, className = "" }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-semibold text-white shadow hover:scale-105 transition-transform duration-200 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl shadow-lg p-4 backdrop-blur-md bg-white/80 border border-green-200 ${className}`}
  >
    {children}
  </div>
);

// === Fix Default Marker Icons ===
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// === Custom Icons ===
const userIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

// === Fit map to route ===
function FitRoute({ route, position, destination, follow }) {
  const map = useMap();
  useEffect(() => {
    if (!follow && route.length > 0 && destination) {
      map.fitBounds([position, destination], { padding: [60, 60] });
    }
  }, [route, position, destination, follow, map]);
  return null;
}

// === Follow user position ===
function FollowUser({ position, follow }) {
  const map = useMap();
  useEffect(() => {
    if (follow && position) map.setView(position, 16);
  }, [position, follow, map]);
  return null;
}

// === Main Component ===
export default function LiveMap() {
  const [position, setPosition] = useState([27.3389, 88.6065]); // fallback
  const [destination, setDestination] = useState(null);
  const [route, setRoute] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [search, setSearch] = useState("");
  const [followUser, setFollowUser] = useState(false);
  const mapRef = useRef(null);

  const sidebarLinks = [
    { name: "Dashboard", path: "/farmer/dashboard" },
    { name: "List Goods", path: "/farmer/listParali" },
    { name: "AI Price Predictor", path: "/farmer/pricePredictor" },
    { name: "Live Route Map", path: "/farmer/liveMap" },
  ];

  // === Track current location ===
  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => console.warn(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // === Fetch coordinates of destination ===
  const fetchCoordinates = async (place) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          place
        )}&format=json&limit=1`
      );
      const data = await res.json();
      if (data.length > 0)
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      return null;
    } catch (err) {
      console.error("Error fetching coordinates:", err);
      return null;
    }
  };

  // === Fetch route using OpenRouteService ===
  const getRoute = async (destCoords) => {
    try {
      const key =
        "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJjYjNlYTlkNjIyYjQ0MGJhZjgwODI3MDJhYmU0MmYwIiwiaCI6Im11cm11cjY0In0=";

      const res = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${key}&start=${position[1]},${position[0]}&end=${destCoords[1]},${destCoords[0]}`
      );
      const data = await res.json();

      const coords = data.features[0].geometry.coordinates.map((c) => [
        c[1],
        c[0],
      ]);
      setRoute(coords);
      setDestination(destCoords);

      const steps = data.features[0].properties.segments[0].steps.map((s) => ({
        instruction: s.instruction,
        distance: (s.distance / 1000).toFixed(2),
        duration: Math.round(s.duration / 60),
      }));
      setInstructions(steps);

      if (mapRef.current) mapRef.current.setView(destCoords, 15);
    } catch (err) {
      console.error("Failed to fetch route:", err);
      setRoute([position, destCoords]);
      setDestination(destCoords);
    }
  };

  // === Handle destination search ===
  const handleSearch = async () => {
    if (!search.trim()) return;
    const coords = await fetchCoordinates(search);
    if (coords) await getRoute(coords);
    else alert("Destination not found!");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* ✅ Sidebar */}
      <div className="w-64 bg-white border-r border-green-200 p-4">
        <Sidebar links={sidebarLinks} brand="Farmer Portal" />
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="text-green-600 w-7 h-7" />
            <h1 className="text-3xl font-bold text-green-700">
              Live Route Tracker
            </h1>
          </div>
          <p className="text-green-800 text-sm">
            View real-time route and navigation between your location and any
            destination.
          </p>
        </div>

        {/* Search Controls */}
        <div className="flex justify-center items-center gap-3 mb-8">
          <Input
            placeholder="Enter destination..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-72 bg-white"
          />
          <Button
            onClick={handleSearch}
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" /> Get Route
          </Button>
          <Button
            onClick={() => setFollowUser(!followUser)}
            className={`flex items-center gap-2 ${
              followUser
                ? "bg-green-700 hover:bg-green-800"
                : "bg-gray-600 hover:bg-gray-700"
            }`}
          >
            <LocateFixed className="w-4 h-4" />
            {followUser ? "Following You" : "Follow Me"}
          </Button>
        </div>

        {/* Map and Directions */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Map Section */}
          <motion.div
            className="flex-1 rounded-xl overflow-hidden shadow-xl border border-green-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MapContainer
              whenCreated={(map) => (mapRef.current = map)}
              center={position}
              zoom={13}
              scrollWheelZoom
              className="w-full h-[70vh]"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <Marker position={position} icon={userIcon}>
                <Popup>You are here</Popup>
              </Marker>

              {destination && (
                <Marker position={destination} icon={destinationIcon}>
                  <Popup>Destination</Popup>
                </Marker>
              )}

              {route.length > 0 && (
                <Polyline
                  positions={route}
                  pathOptions={{ color: "#16a34a", weight: 5 }}
                />
              )}

              <FitRoute
                route={route}
                position={position}
                destination={destination}
                follow={followUser}
              />
              <FollowUser position={position} follow={followUser} />
            </MapContainer>
          </motion.div>

          {/* Directions Section */}
          <Card className="lg:w-[25rem] h-[70vh] flex flex-col overflow-hidden">
            <h2 className="text-lg font-semibold text-green-700 mb-3 text-center">
              Route Directions
            </h2>
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              <AnimatePresence>
                {instructions.length > 0 ? (
                  instructions.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="p-2 rounded-md bg-green-50 border border-green-200 text-green-800 shadow-sm"
                    >
                      {step.instruction}
                      <div className="text-xs text-green-600">
                        {step.distance} km · {step.duration} min
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-green-600 text-center">
                    No route selected yet.
                  </p>
                )}
              </AnimatePresence>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}



