import { useState } from 'react'
import { scanURL } from '../lib/claude'
import ResultBadge from '../components/ResultBadge'
import { Loader2 } from 'lucide-react'

export default function URLScanner() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleScan() {
    if (!url.trim()) return
    setLoading(true); setResult(null); setError('')
    try {
      const data = await scanURL(url)
      setResult(data)
    } catch (e) {
      setError('Scan failed. Check your API key or network.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-cyber-cyan mb-6">URL Scanner</h1>
      <div className="flex gap-3">
        <input value={url} onChange={e => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 bg-cyber-card border border-cyber-border rounded-xl px-4 py-3 text-cyber-text placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan" />
        <button onClick={handleScan} disabled={loading}
          className="bg-cyber-cyan text-cyber-bg font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
          {loading ? <Loader2 size={18} className="animate-spin" /> : null} Scan
        </button>
      </div>
      {error && <p className="text-cyber-red mt-4">{error}</p>}
      {result && (
        <div className="mt-8 bg-cyber-card border border-cyber-border rounded-2xl p-6 space-y-4 animate-fade-in">
          <ResultBadge verdict={result.verdict} confidence={result.confidence} />
          <p className="text-cyber-text">{result.details}</p>
          <ul className="list-disc list-inside text-cyber-muted text-sm space-y-1">
            {result.reasons?.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}