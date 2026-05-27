import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import Home from "@/pages/Home";
import Manifesto from "@/pages/Manifesto";
import Technology from "@/pages/Technology";
import Roadmap from "@/pages/Roadmap";
import Contribute from "@/pages/Contribute";

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <ParticleBackground />
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manifesto" element={<Manifesto />} />
            <Route path="/technology" element={<Technology />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/contribute" element={<Contribute />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
