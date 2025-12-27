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

    let fallbackTriggered = false

    const speakWithWebSpeech = () => {
      if (fallbackTriggered) return
      fallbackTriggered = true

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'th-TH'
        utterance.rate = 0.8
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

    try {
      const audio = new Audio(
        `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=th&q=${encodeURIComponent(text)}`
      )

      audio.onended = () => {
        isPlaying.value = false
      }

      audio.onerror = () => {
        speakWithWebSpeech()
      }

      audio.play().catch(() => {
        speakWithWebSpeech()
      })
    } catch {
      speakWithWebSpeech()
    }
  }

  return {
    isPlaying,
    speak,
  }
}
