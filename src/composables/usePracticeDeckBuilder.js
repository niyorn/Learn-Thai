import { consonantsData } from '@/data/consonants'
import { vowelsData } from '@/data/vowels'
import { wordsData } from '@/data/words'

/**
 * Composable for building and shuffling practice card decks
 */
export function usePracticeDeckBuilder() {
  /**
   * Fisher-Yates shuffle algorithm
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  /**
   * Build a practice deck based on filter
   * @param {string} filter - 'all' | 'consonants' | 'vowels' | 'words'
   * @returns {Array} Shuffled array of cards with type property
   */
  const buildDeck = (filter) => {
    const cards = []

    if (filter === 'all' || filter === 'consonants') {
      consonantsData.essential.forEach((c) => cards.push({ ...c, type: 'consonant' }))
      consonantsData.secondary.forEach((c) => cards.push({ ...c, type: 'consonant' }))
    }

    if (filter === 'all' || filter === 'vowels') {
      vowelsData.essential.forEach((v) => cards.push({ ...v, type: 'vowel' }))
      vowelsData.secondary.forEach((v) => cards.push({ ...v, type: 'vowel' }))
    }

    if (filter === 'all' || filter === 'words') {
      Object.values(wordsData).flat().forEach((w) => cards.push({ ...w, type: 'word' }))
    }

    return shuffleArray(cards)
  }

  /**
   * Build a deck from specific cards (e.g., missed cards)
   * @param {Array} cards - Array of cards to shuffle
   * @returns {Array} Shuffled array of cards
   */
  const buildDeckFromCards = (cards) => {
    return shuffleArray(cards)
  }

  return {
    shuffleArray,
    buildDeck,
    buildDeckFromCards
  }
}
