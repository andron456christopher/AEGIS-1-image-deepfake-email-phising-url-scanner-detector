import { useState } from 'react'
import { scanImageForDeepfake, scanMediaDescription } from '../lib/claude'
import ResultBadge from '../components/ResultBadge'
import { Loader2, Upload } from 'lucide-react'

export default function DeepfakeScanner() {
    const [tab, setTab] = useState('image')
    const [description, setDescription] = useState('')
    const [mediaType, setMediaType] = useState('video')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [preview, setPreview] = useState(null)

    async function handleImageUpload(e) {
        const file = e.target.files[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = async () => {
            const base64 = reader.result.split(',')[1]
            setPreview(reader.result)
            setLoading(true); setResult(null); setError('')
            try {
                setResult(await scanImageForDeepfake(base64, file.type))
            } catch { setError('Scan failed. Check your API key.') }
            setLoading(false)
        }
        reader.readAsDataURL(file)
    }

    async function handleMediaScan() {
        if (!description.trim()) return
        setLoading(true); setResult(null); setError('')
        try {
            setResult(await scanMediaDescription(description, mediaType))
        } catch { setError('Scan failed. Check your API key.') }
        setLoading(false)
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-cyber-green mb-6">Deepfake Detector</h1>
            <div className="flex gap-2 mb-6">
                {['image', 'video/audio'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${tab === t ? 'bg-cyber-green text-cyber-bg' : 'bg-cyber-card text-cyber-muted border border-cyber-border'}`}>
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                    </button>
                ))}
            </div>

            {tab === 'image' ? (
                <label className="block border-2 border-dashed border-cyber-border rounded-2xl p-12 text-center cursor-pointer hover:border-cyber-green transition-colors">
                    <Upload size={36} className="mx-auto mb-3 text-cyber-green" />
                    <p className="text-cyber-muted">Upload image to analyze</p>
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    {preview && <img src={preview} alt="preview" className="mt-4 max-h-48 mx-auto rounded-xl" />}
                </label>
            ) : (
                <div className="space-y-3">
                    <select value={mediaType} onChange={e => setMediaType(e.target.value)}
                        className="bg-cyber-card border border-cyber-border rounded-xl px-4 py-2 text-cyber-text">
                        <option value="video">Video</option>
                        <option value="audio">Audio</option>
                    </select>
                    <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
                        placeholder="Describe the video/audio content, suspicious signs you've noticed, source, context..."
                        className="w-full bg-cyber-card border border-cyber-border rounded-xl px-4 py-3 text-cyber-text placeholder-cyber-muted focus:outline-none focus:border-cyber-green resize-none" />
                    <button onClick={handleMediaScan} disabled={loading}
                        className="bg-cyber-green text-cyber-bg font-bold px-6 py-3 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : null} Analyze
                    </button>
                </div>
            )}

            {loading && <div className="mt-6 flex items-center gap-3 text-cyber-green"><Loader2 className="animate-spin" /> Analyzing...</div>}
            {error && <p className="text-cyber-red mt-4">{error}</p>}
            {result && (
                <div className="mt-8 bg-cyber-card border border-cyber-border rounded-2xl p-6 space-y-4 animate-fade-in">
                    <ResultBadge verdict={result.verdict} confidence={result.confidence} />
                    <p className="text-cyber-text">{result.details}</p>
                    {result.note && <p className="text-cyber-yellow text-sm italic">{result.note}</p>}
                    <ul className="list-disc list-inside text-cyber-muted text-sm space-y-1">
                        {result.indicators?.map((ind, i) => <li key={i}>{ind}</li>)}
                    </ul>
                </div>
            )}
        </div>
    )
}