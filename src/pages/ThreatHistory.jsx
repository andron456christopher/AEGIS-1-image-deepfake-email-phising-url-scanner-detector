import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import {
  ShieldHalf,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCcw,
  Clock,
  Link2,
  Mail,
  ScanFace,
  ServerCrash
} from 'lucide-react'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRiskConfig(score) {
  if (score <= 30) return { color: 'text-cyber-green', bg: 'bg-cyber-green/10', border: 'border-cyber-green/40', Icon: CheckCircle }
  if (score <= 60) return { color: 'text-cyber-yellow', bg: 'bg-cyber-yellow/10', border: 'border-cyber-yellow/40', Icon: AlertCircle }
  if (score <= 80) return { color: 'text-cyber-orange', bg: 'bg-cyber-orange/10', border: 'border-cyber-orange/40', Icon: AlertTriangle }
  return { color: 'text-cyber-red', bg: 'bg-cyber-red/10', border: 'border-cyber-red/40', Icon: XCircle }
}

function getTypeConfig(type) {
  switch (type) {
    case 'URL': return { label: 'URL Scan', Icon: Link2, color: 'text-cyber-cyan', bg: 'bg-cyber-cyan/10' }
    case 'Email': return { label: 'Email Scan', Icon: Mail, color: 'text-cyber-purple', bg: 'bg-cyber-purple/10' }
    case 'Deepfake': return { label: 'Deepfake Scan', Icon: ScanFace, color: 'text-cyber-orange', bg: 'bg-cyber-orange/10' }
    default: return { label: 'Scan', Icon: ShieldHalf, color: 'text-cyber-muted', bg: 'bg-cyber-surface' }
  }
}

function timeAgo(dateString) {
  const date = new Date(dateString)
  const seconds = Math.floor((new Date() - date) / 1000)
  
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ThreatHistory() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      // Fetch concurrently from all 3 tables
      const [urlData, emailData, deepfakeData] = await Promise.all([
        supabase.from('url_scans').select('created_at, risk_score, threat_category, url').order('created_at', { ascending: false }).limit(10),
        supabase.from('email_scans').select('created_at, risk_score, threat_category, sender_email').order('created_at', { ascending: false }).limit(10),
        supabase.from('deepfake_scans').select('created_at, risk_score, explanation, file_name').order('created_at', { ascending: false }).limit(10)
      ])

      if (urlData.error) throw urlData.error
      if (emailData.error) throw emailData.error
      if (deepfakeData.error) throw deepfakeData.error

      // Normalize records
      const urls = (urlData.data || []).map(r => ({
        ...r,
        type: 'URL',
        target: r.url
      }))

      const emails = (emailData.data || []).map(r => ({
        ...r,
        type: 'Email',
        target: r.sender_email
      }))

      const deepfakes = (deepfakeData.data || []).map(r => ({
        ...r,
        type: 'Deepfake',
        // Deepfakes don't have a rigid threat_category string matching the others in the DB schema provided by the user, 
        // but we can derive it from risk_score for display consistency
        threat_category: r.risk_score <= 25 ? 'Likely Real' : r.risk_score <= 55 ? 'Possibly Manipulated' : r.risk_score <= 80 ? 'Likely Deepfake' : 'Almost Certainly Deepfake',
        target: r.file_name
      }))

      // Combine, sort, and slice
      const combined = [...urls, ...emails, ...deepfakes]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 10)

      setHistory(combined)
    } catch (err) {
      console.error('Error fetching history:', err)
      setError('Could not load threat history. Check your connection or Supabase settings.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchHistory()
  }

  return (
    <div className="module-content">
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 pb-20 space-y-6">
        
        {/* Header section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-cyber-border mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="text-cyber-cyan" size={24} />
              Threat History
            </h2>
            <p className="text-cyber-muted text-sm mt-1">Recent scans across all Aegis modules</p>
          </div>
          
          <button 
            onClick={handleRefresh} 
            disabled={loading || refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-cyber-surface border border-cyber-border hover:border-cyber-cyan/50 rounded-xl text-sm font-medium transition-all group disabled:opacity-50"
          >
            <RefreshCcw size={16} className={`text-cyber-cyan group-hover:text-white transition-colors ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Content */}
        {loading && !refreshing ? (
          <div className="py-20 flex flex-col items-center justify-center text-cyber-muted space-y-4">
            <div className="w-10 h-10 border-2 border-cyber-cyan border-t-transparent rounded-full animate-spin" />
            <p>Loading history sequence...</p>
          </div>
        ) : error ? (
          <div className="cyber-card border-cyber-red/30 bg-cyber-red/5 flex flex-col items-center justify-center py-12 text-center">
            <ServerCrash size={40} className="text-cyber-red mb-4" />
            <h3 className="text-cyber-red font-semibold text-lg mb-2">Connection Error</h3>
            <p className="text-cyber-muted text-sm max-w-md">{error}</p>
            <button onClick={handleRefresh} className="mt-6 px-6 py-2 bg-cyber-red/10 hover:bg-cyber-red/20 border border-cyber-red/30 text-cyber-red rounded-xl font-medium transition-colors">
              Try Again
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="cyber-card flex flex-col items-center justify-center py-20 text-center border-dashed border-cyber-border">
            <div className="w-16 h-16 rounded-full bg-cyber-surface flex items-center justify-center mb-4">
              <ShieldHalf size={32} className="text-cyber-muted" />
            </div>
            <h3 className="text-white font-medium text-lg mb-1">No Scans Yet</h3>
            <p className="text-cyber-muted">Your recent scan history will appear here once you use the modules.</p>
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {history.map((item, idx) => {
              const risk = getRiskConfig(item.risk_score)
              const type = getTypeConfig(item.type)

              return (
                <div key={idx} className={`cyber-card hover:border-cyber-cyan/30 transition-colors p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 ${risk.bg.replace('/10', '/5')}`}>
                  
                  {/* Left: Score Badge */}
                  <div className={`flex-shrink-0 flex flex-col items-center justify-center w-16 h-16 rounded-2xl border ${risk.bg} ${risk.border}`}>
                    <span className={`text-2xl font-black ${risk.color}`}>{item.risk_score}</span>
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${type.bg} ${type.color}`}>
                        <type.Icon size={12} />
                        {type.label}
                      </span>
                      <span className="text-cyber-muted/40">•</span>
                      <span className={`text-xs font-bold uppercase tracking-wide ${risk.color}`}>
                        {item.threat_category}
                      </span>
                    </div>
                    <p className="text-cyber-text text-sm font-medium truncate" title={item.target}>
                      {item.target}
                    </p>
                  </div>

                  {/* Right: Timestamp */}
                  <div className="flex items-center gap-1.5 text-xs text-cyber-muted font-medium sm:ml-auto whitespace-nowrap bg-cyber-surface/50 px-3 py-1.5 rounded-lg border border-cyber-border">
                    <Clock size={12} />
                    {timeAgo(item.created_at)}
                  </div>
                  
                </div>
              )
            })}
          </div>
        )}

      </main>
    </div>
  )
}
