import { ref, computed } from 'vue'

/**
 * Composable for managing practice session state
 */
export function usePracticeState() {
  const cards = ref([])
  const currentIndex = ref(0)
  const flipped = ref(false)
  const stats = ref({ correct: 0, incorrect: 0, seen: [] })

  // Computed properties
  const isStarted = computed(() => cards.value.length > 0)
  const isFinished = computed(() => currentIndex.value >= cards.value.length)
  const currentCard = computed(() => cards.value[currentIndex.value])
  const totalAnswered = computed(() => stats.value.correct + stats.value.incorrect)
  const percentage = computed(() =>
    totalAnswered.value > 0 ? Math.round((stats.value.correct / totalAnswered.value) * 100) : 0
  )
  const missedCards = computed(() => stats.value.seen.filter((s) => !s.correct))

  /**
   * Start a new practice session with given cards
   * @param {Array} newCards - Array of cards to practice
   */
  const start = (newCards) => {
    cards.value = newCards
    currentIndex.value = 0
    flipped.value = false
    stats.value = { correct: 0, incorrect: 0, seen: [] }
  }

  /**
   * Handle an answer (correct or incorrect)
   * @param {boolean} correct - Whether the answer was correct
   */
  const handleAnswer = (correct) => {
    stats.value = {
      correct: stats.value.correct + (correct ? 1 : 0),
      incorrect: stats.value.incorrect + (correct ? 0 : 1),
      seen: [...stats.value.seen, { card: currentCard.value, correct }]
    }
    flipped.value = false
    currentIndex.value++
  }

  /**
   * Reset the practice session
   */
  const reset = () => {
    cards.value = []
    currentIndex.value = 0
    flipped.value = false
    stats.value = { correct: 0, incorrect: 0, seen: [] }
  }

  /**
   * Toggle the flipped state
   */
  const toggleFlip = () => {
    flipped.value = !flipped.value
  }

  /**
   * Get missed cards for retry
   * @returns {Array} Array of cards that were answered incorrectly
   */
  const getMissedCards = () => {
    return missedCards.value.map((item) => item.card)
  }

  return {
    // State
    cards,
    currentIndex,
    flipped,
    stats,
    // Computed
    isStarted,
    isFinished,
    currentCard,
    totalAnswered,
    percentage,
    missedCards,
    // Methods
    start,
    handleAnswer,
    reset,
    toggleFlip,
    getMissedCards
  }
}
