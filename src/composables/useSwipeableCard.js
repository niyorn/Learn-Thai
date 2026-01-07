import { ref, computed } from 'vue'
import { useSwipeNavigation } from './useSwipeNavigation'
import { useKeyboardNavigation } from './useKeyboardNavigation'

/**
 * Composable for swipeable card navigation with animations.
 *
 * Combines card state management, swipe gestures, keyboard navigation,
 * and animated button navigation into a single reusable composable.
 *
 * @example
 * // Basic usage with reactive data source
 * const activeFilter = ref('essential')
 * const {
 *   cardRef,
 *   cardIndex,
 *   items,
 *   current,
 *   cardStyle,
 *   animateNext,
 *   animatePrev,
 *   resetCard
 * } = useSwipeableCard(() => data[activeFilter.value])
 *
 * // In template:
 * // <div ref="cardRef" :style="cardStyle">{{ current.name }}</div>
 * // <button @click="animatePrev">Prev</button>
 * // <button @click="animateNext">Next</button>
 *
 * @param {Function} itemsGetter - Function that returns the current array of items.
 *                                 Called reactively when dependencies change.
 * @param {Object} [options={}] - Configuration options
 * @param {boolean} [options.wrapAround=false] - If true, navigation wraps from last to first
 *                                               and vice versa. If false, stops at boundaries.
 * @param {Function} [options.onFlip] - Optional callback for flip keyboard shortcut (spacebar).
 *                                      Useful for flip cards that need keyboard support.
 *
 * @returns {Object} Card state and navigation methods
 * @returns {Ref<HTMLElement|null>} returns.cardRef - Template ref to attach to card element
 * @returns {Ref<number>} returns.cardIndex - Current card index (0-based)
 * @returns {ComputedRef<Array>} returns.items - Computed array of all items
 * @returns {ComputedRef<Object>} returns.current - Computed current item at cardIndex
 * @returns {ComputedRef<Object>} returns.cardStyle - CSS styles for swipe animation
 * @returns {ComputedRef<boolean>} returns.canGoNext - Whether next navigation is possible
 * @returns {ComputedRef<boolean>} returns.canGoPrev - Whether previous navigation is possible
 * @returns {Function} returns.nextCard - Navigate to next card (no animation)
 * @returns {Function} returns.prevCard - Navigate to previous card (no animation)
 * @returns {Function} returns.resetCard - Reset to first card (index 0)
 * @returns {Function} returns.animateNext - Navigate to next with exit animation
 * @returns {Function} returns.animatePrev - Navigate to previous with exit animation
 * @returns {Function} returns.triggerExit - Low-level animation trigger for custom use
 */
export function useSwipeableCard(itemsGetter, options = {}) {
  const { wrapAround = false, onFlip = () => {} } = options

  // ============================================
  // State
  // ============================================

  /**
   * Template ref for the card element.
   * Must be attached to the swipeable element in the template.
   */
  const cardRef = ref(null)

  /**
   * Current card index (0-based).
   * Automatically bounded by items length.
   */
  const cardIndex = ref(0)

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
   * Returns empty object if index is out of bounds.
   */
  const current = computed(() => items.value[cardIndex.value] || {})

  /**
   * Whether navigation to the next card is possible.
   * Always true if wrapAround is enabled.
   */
  const canGoNext = computed(() =>
    wrapAround || cardIndex.value < items.value.length - 1
  )

  /**
   * Whether navigation to the previous card is possible.
   * Always true if wrapAround is enabled.
   */
  const canGoPrev = computed(() =>
    wrapAround || cardIndex.value > 0
  )

  // ============================================
  // Navigation Methods (No Animation)
  // ============================================

  /**
   * Navigate to the next card without animation.
   * Used internally by swipe gestures and keyboard navigation.
   * Respects wrapAround option for boundary behavior.
   */
  const nextCard = () => {
    if (wrapAround) {
      cardIndex.value = (cardIndex.value + 1) % items.value.length
    } else if (cardIndex.value < items.value.length - 1) {
      cardIndex.value++
    }
  }

  /**
   * Navigate to the previous card without animation.
   * Used internally by swipe gestures and keyboard navigation.
   * Respects wrapAround option for boundary behavior.
   */
  const prevCard = () => {
    if (wrapAround) {
      cardIndex.value = (cardIndex.value - 1 + items.value.length) % items.value.length
    } else if (cardIndex.value > 0) {
      cardIndex.value--
    }
  }

  /**
   * Reset card index to 0.
   * Call this when changing data sources (e.g., filter change).
   */
  const resetCard = () => {
    cardIndex.value = 0
  }

  // ============================================
  // Swipe Navigation Setup
  // ============================================

  /**
   * useSwipeNavigation provides:
   * - cardStyle: CSS transform/opacity for drag and animation effects
   * - triggerExit: Programmatic animation trigger for button clicks
   *
   * Swipe callbacks are connected to nextCard/prevCard.
   */
  const { cardStyle, triggerExit } = useSwipeNavigation(cardRef, {
    onSwipeLeft: nextCard,
    onSwipeRight: prevCard
  })

  // ============================================
  // Keyboard Navigation Setup
  // ============================================

  /**
   * Enables arrow key navigation:
   * - ArrowRight: next card
   * - ArrowLeft: previous card
   * - Spacebar: flip (if onFlip provided)
   */
  useKeyboardNavigation({
    onNext: nextCard,
    onPrev: prevCard,
    onFlip
  })

  // ============================================
  // Animated Navigation (For Buttons)
  // ============================================

  /**
   * Navigate to next card with exit animation.
   * Card exits to the left, new card enters from the right.
   * Use this for "Next" button click handlers.
   */
  const animateNext = () => {
    if (canGoNext.value) {
      triggerExit('left', nextCard)
    }
  }

  /**
   * Navigate to previous card with exit animation.
   * Card exits to the right, new card enters from the left.
   * Use this for "Previous" button click handlers.
   */
  const animatePrev = () => {
    if (canGoPrev.value) {
      triggerExit('right', prevCard)
    }
  }

  // ============================================
  // Return Public API
  // ============================================

  return {
    // Refs (attach to template)
    cardRef,
    cardIndex,

    // Computed state
    items,
    current,
    cardStyle,
    canGoNext,
    canGoPrev,

    // Navigation methods
    nextCard,
    prevCard,
    resetCard,

    // Animated navigation (for buttons)
    animateNext,
    animatePrev,

    // Low-level access (for advanced use cases)
    triggerExit
  }
}
