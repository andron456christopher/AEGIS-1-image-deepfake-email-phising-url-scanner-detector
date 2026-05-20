import { useState } from 'react'
import { scanEmail } from '../lib/claude'
import ResultBadge from '../components/ResultBadge'
import { Loader2 } from 'lucide-react'

export default function EmailScanner() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleScan() {
    if (!text.trim()) return
    setLoading(true); setResult(null); setError('')
    try {
      setResult(await scanEmail(text))
    } catch { setError('Scan failed. Check your API key.') }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-cyber-purple mb-6">Email Scanner</h1>
      <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
        placeholder="Paste the full email content here..."
        className="w-full bg-cyber-card border border-cyber-border rounded-xl px-4 py-3 text-cyber-text placeholder-cyber-muted focus:outline-none focus:border-cyber-purple resize-none" />
      <button onClick={handleScan} disabled={loading}
        className="mt-3 bg-cyber-purple text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
        {loading ? <Loader2 size={18} className="animate-spin" /> : null} Analyze Email
      </button>
      {error && <p className="text-cyber-red mt-4">{error}</p>}
      {result && (
        <div className="mt-8 bg-cyber-card border border-cyber-border rounded-2xl p-6 space-y-4 animate-fade-in">
          <ResultBadge verdict={result.verdict} confidence={result.confidence} />
          <p className="text-cyber-text">{result.details}</p>
          <ul className="list-disc list-inside text-cyber-muted text-sm space-y-1">
            {result.redFlags?.map((f, i) => <li key={i}>{f}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}