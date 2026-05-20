const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callAI(prompt) {
    const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "AegisAI"
        },
        body: JSON.stringify({
            model: "openrouter/auto",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.1
        }),
    });
    const data = await res.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
}

async function callAIVision(prompt, base64Image, mimeType) {
    const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "AegisAI"
        },
        body: JSON.stringify({
            model: "openrouter/auto",
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: prompt },
                    { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } }
                ]
            }],
            temperature: 0.1
        }),
    });
    const data = await res.json();
    const text = data.choices[0].message.content;
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
}

// ── URL Scanner ──────────────────────────────────────────
export async function scanURL(url) {
    return callAI(`You are a cybersecurity expert. Analyze this URL for phishing, malware, or malicious intent: ${url}

Respond ONLY in this exact JSON format with no markdown:
{
  "verdict": "SAFE or SUSPICIOUS or MALICIOUS",
  "confidence": 0-100,
  "reasons": ["reason1", "reason2"],
  "details": "brief explanation"
}`);
}

// ── Email Scanner ─────────────────────────────────────────
export async function scanEmail(emailText) {
    return callAI(`You are an email security analyst. Detect phishing, social engineering, and scams in this email:

${emailText}

Respond ONLY in this exact JSON format with no markdown:
{
  "verdict": "SAFE or SUSPICIOUS or PHISHING",
  "confidence": 0-100,
  "redFlags": ["flag1", "flag2"],
  "details": "brief explanation"
}`);
}

// ── Deepfake Scanner (Image) ──────────────────────────────
export async function scanImageForDeepfake(base64Image, mimeType = "image/jpeg") {
    return callAIVision(
        `You are a deepfake detection expert. Analyze this image for signs of AI manipulation.

Respond ONLY in this exact JSON format with no markdown:
{
  "verdict": "AUTHENTIC or SUSPICIOUS or LIKELY_DEEPFAKE",
  "confidence": 0-100,
  "indicators": ["indicator1", "indicator2"],
  "details": "brief explanation"
}`,
        base64Image,
        mimeType
    );
}

// ── Deepfake Scanner (Video/Audio) ────────────────────────
export async function scanMediaDescription(description, mediaType = "video") {
    return callAI(`You are a deepfake detection expert. Based on this ${mediaType} description, assess deepfake likelihood:

${description}

Respond ONLY in this exact JSON format with no markdown:
{
  "verdict": "AUTHENTIC or SUSPICIOUS or LIKELY_DEEPFAKE",
  "confidence": 0-100,
  "indicators": ["indicator1", "indicator2"],
  "details": "brief explanation",
  "note": "Manual review recommended for definitive results"
}`);
}