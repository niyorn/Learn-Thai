import { ref } from 'vue'

export function useSpeech() {
  const isPlaying = ref(false)

  const speak = (text) => {
    if (!text) return

    isPlaying.value = true

    try {
      const audio = new Audio(
        `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=${encodeURIComponent(text)}`
      )

      audio.onended = () => {
        isPlaying.value = false
      }

      audio.onerror = () => {
        // Fallback to Web Speech API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = 'th-TH'
          utterance.rate = 0.8
          utterance.onend = () => {
            isPlaying.value = false
          }
          window.speechSynthesis.speak(utterance)
        } else {
          isPlaying.value = false
        }
      }

      audio.play().catch(() => {
        // Fallback to Web Speech API
        if ('speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = 'th-TH'
          utterance.rate = 0.8
          utterance.onend = () => {
            isPlaying.value = false
          }
          window.speechSynthesis.speak(utterance)
        } else {
          isPlaying.value = false
        }
      })
    } catch {
      isPlaying.value = false
    }

    // Auto-reset after 1 second as fallback
    setTimeout(() => {
      isPlaying.value = false
    }, 1000)
  }

  return {
    isPlaying,
    speak,
  }
}
