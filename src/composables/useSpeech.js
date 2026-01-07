import { ref } from 'vue'

export function useSpeech() {
  const isPlaying = ref(false)

  const speak = (text) => {
    if (!text || isPlaying.value) return

    isPlaying.value = true

    // Cancel any ongoing speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }

    // Use Web Speech API with Thai voice preference
    // This provides the most reliable cross-browser Thai pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'th-TH'
      utterance.rate = 0.85

      // Try to find a Thai voice for more natural pronunciation
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
