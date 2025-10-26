import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  MeshDistortMaterial,
  Sphere,
  Box,
  Torus,
  Cone,
  Cylinder
} from "@react-three/drei";
import {
  MapPin,
  Globe,
  Calendar,
  Archive,
  BookOpen,
  Headphones,
  Shield,
  Gift,
  ChevronRight,
  Leaf,
  Activity,
  Star,
  TrendingUp,
  Truck
} from "lucide-react";

// 3D Icon Component
function Icon3D({ type, color }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  const Geometry = (() => {
    switch (type) {
      case "sphere": return Sphere;
      case "box": return Box;
      case "torus": return Torus;
      case "cone": return Cone;
      case "cylinder": return Cylinder;
      default: return Sphere;
    }
  })();

  const args = {
    sphere: [1, 32, 32],
    box: [1.5, 1.5, 1.5],
    torus: [1, 0.4, 16, 100],
    cone: [1, 1.8, 32],
    cylinder: [0.8, 0.8, 1.5, 32]
  }[type] || [1, 32, 32];

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <group
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <Geometry ref={meshRef} args={args}>
          <MeshDistortMaterial
            color={color}
            distort={0.4}
            speed={2}
            roughness={0.2}
            metalness={0.8}
          />
        </Geometry>
      </group>
    </Float>
  );
}

// Features Data
const haryaliFeatures = [
  { icon: <Activity className="w-6 h-6" />, icon3D: "box", title: "Farmer Onboarding", description: "Simple voice or app registration for farmers in regional languages.", color: "#10b981", gradient: "from-emerald-400 to-green-500" },
  { icon: <MapPin className="w-6 h-6" />, icon3D: "cone", title: "Interactive Maps", description: "Locate farms, view ready-for-pickup listings, and track deliveries.", color: "#22c55e", gradient: "from-green-400 to-emerald-600" },
  { icon: <Calendar className="w-6 h-6" />, icon3D: "box", title: "Harvest Scheduling", description: "Farmers set harvest dates and mark 'Ready for Pickup' easily.", color: "#84cc16", gradient: "from-lime-400 to-green-500" },
  { icon: <Shield className="w-6 h-6" />, icon3D: "sphere", title: "Secure Payments", description: "Instant UPI payouts with escrow and encrypted transactions.", color: "#059669", gradient: "from-green-500 to-emerald-600" },
  { icon: <TrendingUp className="w-6 h-6" />, icon3D: "torus", title: "AI Price Prediction", description: "Predict fair crop residue price per ton based on supply, distance, and moisture.", color: "#14b8a6", gradient: "from-teal-400 to-green-500" },
  { icon: <Globe className="w-6 h-6" />, icon3D: "sphere", title: "Satellite Yield Estimation", description: "Use NDVI satellite data to estimate crop residue yield before listing.", color: "#10b981", gradient: "from-emerald-400 to-teal-500" },
  { icon: <Star className="w-6 h-6" />, icon3D: "box", title: "Gamification & Green Badges", description: "Reward farmers for sustainable practices and reduce crop burning.", color: "#22c55e", gradient: "from-green-400 to-lime-500" },
  { icon: <Truck className="w-6 h-6" />, icon3D: "cylinder", title: "Live Impact Counter", description: "See total tonnes of crop residue saved, CO₂ prevented, and farmers impacted.", color: "#059669", gradient: "from-emerald-500 to-green-600" }
];

// Feature Card Component
function FeatureCard({ feature, index }) {
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100 - 50,
        y: Math.random() * 100 - 50,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);
    } else setParticles([]);
  }, [isHovered]);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both` }}
    >
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-1 h-1 bg-green-400 rounded-full pointer-events-none"
          style={{ left: "50%", top: "50%", animation: `particle 1.5s ease-out ${p.delay}s forwards`, "--tx": `${p.x}px`, "--ty": `${p.y}px` }}
        />
      ))}

      <div className="relative h-full p-8 rounded-3xl transition-all duration-500 hover:scale-105 cursor-pointer bg-gradient-to-br from-gray-900/90 to-green-950/90 hover:from-gray-900 hover:to-green-950 backdrop-blur-xl border border-green-700/30 hover:border-green-500/50 shadow-xl hover:shadow-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-all duration-700 blur-3xl`} />
        <div className="relative z-10 flex flex-col items-center text-center h-full">
          <div className="w-32 h-32 mb-6 relative">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[-10, -10, -5]} intensity={0.5} color={feature.color} />
              <Icon3D type={feature.icon3D} color={feature.color} />
            </Canvas>
            <div className={`absolute bottom-2 right-2 p-2 rounded-xl bg-gradient-to-r ${feature.gradient} text-white shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12`}>
              {feature.icon}
            </div>
          </div>
          <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-300">{feature.title}</h3>
          <p className="text-gray-300 leading-relaxed mb-6 flex-1">{feature.description}</p>
          <div className="flex items-center justify-center gap-2 text-green-400 group-hover:text-emerald-300 transition-all duration-300 font-semibold">
            <Leaf className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span>Explore Feature</span>
            <ChevronRight className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Features Section
export default function FeaturesSection() {
  const [statsCount, setStatsCount] = useState({ tonnes: 0, co2: 0, farmers: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStatsCount(prev => ({
        tonnes: Math.min(prev.tonnes + 47, 15420),
        co2: Math.min(prev.co2 + 103, 34890),
        farmers: Math.min(prev.farmers + 12, 4250)
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative px-6 py-24 bg-gradient-to-br from-gray-900 via-green-950 to-gray-900 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10 text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/30 mb-6">
          <Leaf className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-semibold text-sm tracking-wide">SUSTAINABLE SOLUTIONS</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Discover the Key Features of{" "}
          <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent animate-gradient">Haryali</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">Experience crop residue management like never before — farmers, buyers, and logistics providers all connected in one smart platform.</p>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { label: "Tonnes Saved", value: statsCount.tonnes.toLocaleString(), suffix: "+", icon: "🌾", gradient: "from-green-500 to-emerald-600" },
            { label: "CO₂ Prevented (kg)", value: statsCount.co2.toLocaleString(), suffix: "+", icon: "🌍", gradient: "from-emerald-500 to-teal-600" },
            { label: "Farmers Helped", value: statsCount.farmers.toLocaleString(), suffix: "+", icon: "👨‍🌾", gradient: "from-lime-500 to-green-600" }
          ].map((stat, i) => (
            <div key={i} className="group p-6 rounded-2xl bg-gradient-to-br from-gray-900/80 to-green-950/80 backdrop-blur-sm border border-green-500/20 hover:border-green-400/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}{stat.suffix}</div>
              <div className="text-sm text-gray-400 mt-1 group-hover:text-gray-300 transition-colors">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {haryaliFeatures.map((feature, index) => <FeatureCard key={index} feature={feature} index={index} />)}
      </div>
      <div className="mt-20 text-center">
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group">
          <span>Start Your Green Journey</span>
          <Leaf className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        @keyframes particle { 0% { transform: translate(0,0) scale(1); opacity:1; } 100% { transform: translate(var(--tx), var(--ty)) scale(0); opacity:0; } }
        @keyframes gradient { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        .animate-gradient { background-size:200% 200%; animation: gradient 3s ease infinite; }
      `}</style>
    </section>
  );
}
