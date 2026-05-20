const colors = {
    SAFE: 'text-cyber-green border-cyber-green',
    AUTHENTIC: 'text-cyber-green border-cyber-green',
    SUSPICIOUS: 'text-cyber-yellow border-cyber-yellow',
    MALICIOUS: 'text-cyber-red border-cyber-red',
    PHISHING: 'text-cyber-red border-cyber-red',
    LIKELY_DEEPFAKE: 'text-cyber-red border-cyber-red',
}

export default function ResultBadge({ verdict, confidence }) {
    return (
        <div className={`inline-flex flex-col items-center border-2 rounded-xl px-6 py-3 ${colors[verdict] ?? 'text-cyber-muted border-cyber-muted'}`}>
            <span className="text-2xl font-bold">{verdict}</span>
            <span className="text-sm opacity-75">Confidence: {confidence}%</span>
        </div>
    )
}