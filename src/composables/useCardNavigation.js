import { ref, computed } from 'vue'

/**
 * Composable for managing flip card navigation state and actions.
 *
 * Provides state management for card decks with flip functionality.
 * Used by FlashCardView for vocabulary cards that have front/back sides.
 *
 * DIFFERENCES FROM useSwipeableCard:
 * - Includes flip state (flipped ref)
 * - nextCard/prevCard reset flip and have delay for flip animation
 * - Wraps around by default (last → first, first → last)
 * - Does NOT include swipe handling (FlashCard component handles that)
 *
 * @example
 * const { cardIndex, flipped, current, nextCard, prevCard, toggleFlip } =
 *   useCardNavigation(() => data[activeFilter.value])
 *
 * // In template:
 * // <FlashCard :flipped="flipped" @click="toggleFlip">
 * //   <template #front>{{ current.thai }}</template>
 * //   <template #back>{{ current.meaning }}</template>
 * // </FlashCard>
 *
 * @param {Function} itemsGetter - Function that returns the current array of items.
 *                                 Called reactively when dependencies change.
 *
 * @returns {Object} Navigation state and methods
 * @returns {Ref<number>} returns.cardIndex - Current card index (0-based)
 * @returns {Ref<boolean>} returns.flipped - Whether card is showing back side
 * @returns {ComputedRef<Array>} returns.items - Computed array of all items
 * @returns {ComputedRef<Object>} returns.current - Computed current item at cardIndex
 * @returns {ComputedRef<number>} returns.total - Total number of items
 * @returns {Function} returns.resetCard - Reset to first card, unflipped
 * @returns {Function} returns.nextCard - Go to next card (with flip reset)
 * @returns {Function} returns.prevCard - Go to previous card (with flip reset)
 * @returns {Function} returns.toggleFlip - Toggle card flip state
 */
export function useCardNavigation(itemsGetter) {
  // ============================================
  // State
  // ============================================

  /**
   * Current card index (0-based).
   * Wraps around when reaching boundaries.
   */
  const cardIndex = ref(0)

  /**
   * Whether the card is flipped (showing back side).
   * Reset to false when navigating to a new card.
   */
  const flipped = ref(false)

  // ============================================
  // Computed Properties
  // ============================================

  /**
   * Reactive array of all items.
   * Re-computes when itemsGetter dependencies change.
   */
  const items = computed(() => itemsGetter())

  /**
   * Current item based on cardIndex.
   */
  const current = computed(() => items.value[cardIndex.value])

  /**
   * Total number of items in the deck.
   */
  const total = computed(() => items.value.length)

  // ============================================
  // Navigation Methods
  // ============================================

  /**
   * Reset to the first card in unflipped state.
   * Call this when changing data sources (e.g., filter change).
   */
  const resetCard = () => {
    cardIndex.value = 0
    flipped.value = false
  }

  /**
   * Navigate to the next card.
   *
   * Behavior:
   * 1. Immediately reset flip to show front of next card
   * 2. Wait 150ms for flip animation to complete
   * 3. Advance to next card (wraps to first if at end)
   *
   * The delay ensures smooth visual transition when card is flipped.
   */
  const nextCard = () => {
    flipped.value = false
    setTimeout(() => {
      cardIndex.value = (cardIndex.value + 1) % items.value.length
    }, 150)
  }

  /**
   * Navigate to the previous card.
   *
   * Behavior:
   * 1. Immediately reset flip to show front of previous card
   * 2. Wait 150ms for flip animation to complete
   * 3. Go to previous card (wraps to last if at beginning)
   *
   * The delay ensures smooth visual transition when card is flipped.
   */
  const prevCard = () => {
    flipped.value = false
    setTimeout(() => {
      cardIndex.value = (cardIndex.value - 1 + items.value.length) % items.value.length
    }, 150)
  }

  /**
   * Toggle the card's flip state.
   * Shows the back side if currently showing front, and vice versa.
   */
  const toggleFlip = () => {
    flipped.value = !flipped.value
  }

  // ============================================
  // Return Public API
  // ============================================

  return {
    // State
    cardIndex,
    flipped,

    // Computed
    items,
    current,
    total,

    // Methods
    resetCard,
    nextCard,
    prevCard,
    toggleFlip
  }
}
