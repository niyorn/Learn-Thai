import { ref } from 'vue'

export function useSpeech() {
  const isPlaying = ref(false)

  const speak = (text) => {
    if (!text || isPlaying.value) return

    isPlaying.value = true

    // Use our API proxy to Google Translate TTS for consistent pronunciation
    // This bypasses CORS and provides the same Thai voice on all devices
    const audio = new Audio(`/api/tts?text=${encodeURIComponent(text)}`)

    audio.onended = () => {
      isPlaying.value = false
    }

    audio.onerror = () => {
      // Fallback to Web Speech API if our API fails
      fallbackToWebSpeech(text)
    }

    audio.play().catch(() => {
      fallbackToWebSpeech(text)
    })
  }

  const fallbackToWebSpeech = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'th-TH'
      utterance.rate = 0.85

      const voices = window.speechSynthesis.getVoices()
      const thaiVoice = voices.find(
        (voice) => voice.lang.startsWith('th') || voice.name.toLowerCase().includes('thai')
      )
      if (thaiVoice) {
        utterance.voice = thaiVoice
      }

      utterance.onend = () => {
        isPlaying.value = false
      }
      utterance.onerror = () => {
        isPlaying.value = false
      }
      window.speechSynthesis.speak(utterance)
    } else {
      isPlaying.value = false
    }
  }

  return {
    isPlaying,
    speak,
  }
}
