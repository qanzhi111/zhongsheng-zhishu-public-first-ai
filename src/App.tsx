import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Home from "@/pages/Home";
import Proposals from "@/pages/Proposals";
import ProposalDetail from "@/pages/ProposalDetail";
import CreateProposal from "@/pages/CreateProposal";
import Profile from "@/pages/Profile";
import Compliance from "@/pages/Compliance";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/proposals" element={<Proposals />} />
          <Route path="/proposals/:id" element={<ProposalDetail />} />
          <Route path="/proposals/create" element={<CreateProposal />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/compliance" element={<Compliance />} />
        </Routes>
      </div>
    </Router>
  );
}
