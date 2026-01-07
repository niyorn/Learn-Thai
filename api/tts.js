export default async function handler(req, res) {
  const { text } = req.query

  if (!text) {
    return res.status(400).json({ error: 'Missing text parameter' })
  }

  try {
    // Fetch audio from Google Translate TTS
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=${encodeURIComponent(text)}`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/',
      },
    })

    if (!response.ok) {
      throw new Error(`Google TTS responded with ${response.status}`)
    }

    const audioBuffer = await response.arrayBuffer()

    // Set appropriate headers for audio
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=86400') // Cache for 24 hours

    return res.send(Buffer.from(audioBuffer))
  } catch (error) {
    console.error('TTS Error:', error)
    return res.status(500).json({ error: 'Failed to fetch audio' })
  }
}
