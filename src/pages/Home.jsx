import { Link } from 'react-router-dom'
import { Link2, Mail, FileVideo } from 'lucide-react'

const tools = [
    { to: '/url', icon: Link2, label: 'URL Scanner', desc: 'Detect malicious & phishing URLs', color: 'text-cyber-cyan' },
    { to: '/email', icon: Mail, label: 'Email Scanner', desc: 'Identify phishing & scam emails', color: 'text-cyber-purple' },
    { to: '/deepfake', icon: FileVideo, label: 'Deepfake Detector', desc: 'Analyze images, audio & video', color: 'text-cyber-green' },
]

export default function Home() {
    return (
        <div className="text-center">
            <h1 className="text-4xl font-extrabold text-cyber-cyan mb-2 animate-fade-in">AegisAI</h1>
            <p className="text-cyber-muted mb-12">AI-powered cybersecurity threat detection</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tools.map(({ to, icon: Icon, label, desc, color }) => (
                    <Link key={to} to={to}
                        className="bg-cyber-card border border-cyber-border rounded-2xl p-8 hover:border-cyber-cyan transition-all hover:shadow-glow-cyan animate-slide-up flex flex-col items-center gap-3">
                        <Icon size={36} className={color} />
                        <h2 className="text-lg font-semibold text-cyber-text">{label}</h2>
                        <p className="text-cyber-muted text-sm">{desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}