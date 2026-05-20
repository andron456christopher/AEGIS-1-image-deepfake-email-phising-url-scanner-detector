import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="border-b border-cyber-border bg-cyber-surface px-6 py-4 flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-cyber-cyan font-bold text-xl">
                <Shield size={24} /> AegisAI
            </Link>
            <Link to="/url" className="text-cyber-text hover:text-cyber-cyan transition-colors">URL Scanner</Link>
            <Link to="/email" className="text-cyber-text hover:text-cyber-cyan transition-colors">Email Scanner</Link>
            <Link to="/deepfake" className="text-cyber-text hover:text-cyber-cyan transition-colors">Deepfake Detector</Link>
        </nav>
    )
}