import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import URLScanner from './pages/URLScanner'
import EmailScanner from './pages/EmailScanner'
import DeepfakeScanner from './pages/DeepfakeScanner'

export default function App() {
  return (
    <div className="min-h-screen bg-cyber-bg">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/url" element={<URLScanner />} />
          <Route path="/email" element={<EmailScanner />} />
          <Route path="/deepfake" element={<DeepfakeScanner />} />
        </Routes>
      </main>
    </div>
  )
}