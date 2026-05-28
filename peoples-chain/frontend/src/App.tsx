import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Identity from './pages/Identity'
import Payment from './pages/Payment'
import Medical from './pages/Medical'
import Finance from './pages/Finance'
import Governance from './pages/Governance'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/medical" element={<Medical />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/governance" element={<Governance />} />
      </Routes>
    </Layout>
  )
}

export default App
