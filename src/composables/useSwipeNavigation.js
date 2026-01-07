import { ref, computed } from 'vue'
import { useSwipe } from '@vueuse/core'

/**
 * Composable for handling swipe navigation with Tinder-like animation.
 *
 * Provides touch/swipe gesture detection with visual feedback and exit animations.
 * Cards follow the user's finger during drag and animate out when threshold is reached.
 *
 * USAGE PATTERNS:
 *
 * 1. Direct usage (non-flip cards like Consonants/Vowels):
 *    Use useSwipeableCard composable which wraps this.
 *
 * 2. Component usage (flip cards like Words):
 *    FlashCard component uses this internally and exposes animateOut().
 *
 * @example
 * // Direct usage
 * const cardRef = ref(null)
 * const { cardStyle, triggerExit } = useSwipeNavigation(cardRef, {
 *   onSwipeLeft: () => goToNext(),
 *   onSwipeRight: () => goToPrev()
 * })
 *
 * // In template:
 * // <div ref="cardRef" :style="cardStyle">...</div>
 *
 * // For button clicks:
 * // triggerExit('left', () => goToNext())
 *
 * @param {Ref<HTMLElement>} target - Element to attach swipe listeners to
 * @param {Object} options - Configuration options
 * @param {Function} options.onSwipeLeft - Called when user swipes left (typically: next card)
 * @param {Function} options.onSwipeRight - Called when user swipes right (typically: previous card)
 * @param {number} [options.threshold=80] - Minimum swipe distance (px) to trigger navigation
 *
 * @returns {Object} Swipe state and methods
 * @returns {ComputedRef<SwipeDirection>} returns.direction - Current swipe direction from VueUse
 * @returns {Ref<number>} returns.lengthX - Current horizontal swipe distance
 * @returns {ComputedRef<Object>} returns.cardStyle - CSS styles to apply to the card element
 * @returns {Ref<boolean>} returns.isSwiping - Whether user is currently swiping
 * @returns {Ref<boolean>} returns.isEntering - Whether new card is entering
 * @returns {Function} returns.triggerExit - Programmatically trigger exit animation
 */
export function useSwipeNavigation(target, { onSwipeLeft, onSwipeRight, threshold = 80 }) {
  // ============================================
  // Animation State
  // ============================================

  /** Whether user is currently dragging the card */
  const isSwiping = ref(false)

  /** Whether card is animating out (exiting) */
  const isAnimatingOut = ref(false)

  /** Whether new card is entering (after previous card exited) */
  const isEntering = ref(false)

  /** Direction of current/last swipe ('left' or 'right') */
  const swipeDirection = ref(null)

  /** Current horizontal offset during drag (pixels) */
  const offsetX = ref(0)

  // ============================================
  // Computed Animation Values
  // ============================================

  /** Rotation angle based on drag distance (creates tilting effect) */
  const rotation = computed(() => offsetX.value * 0.1)

  /** Opacity based on drag distance (fades as card moves away) */
  const opacity = computed(() => Math.max(0.5, 1 - Math.abs(offsetX.value) / 300))

  // ============================================
  // Card Style (Apply to element)
  // ============================================

  /**
   * CSS styles to apply to the card element.
   * Handles four states:
   * 1. Entering: new card slides in from appropriate side
   * 2. Exiting: card slides out in swipe direction
   * 3. Resting: card at center position
   * 4. Dragging: card follows finger with tilt
   */
  const cardStyle = computed(() => {
    // State: Card entering from opposite side of swipe direction
    if (isEntering.value) {
      // Swipe left = next card enters from right
      // Swipe right = prev card enters from left
      const enterX = swipeDirection.value === 'left' ? 350 : -350
      return {
        transform: `translateX(${enterX}px) rotate(${enterX * 0.1}deg)`,
        opacity: 0,
        transition: 'none',
      }
    }

    // State: Card exiting in swipe direction
    if (isAnimatingOut.value) {
      const exitX = swipeDirection.value === 'left' ? -350 : 350
      return {
        transform: `translateX(${exitX}px) rotate(${exitX * 0.1}deg)`,
        opacity: 0,
        transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
      }
    }

    // State: Card at rest (center position)
    if (!isSwiping.value) {
      return {
        transform: 'translateX(0) rotate(0deg)',
        opacity: 1,
        transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
      }
    }

    // State: Card being dragged (follows finger)
    return {
      transform: `translateX(${offsetX.value}px) rotate(${rotation.value}deg)`,
      opacity: opacity.value,
      transition: 'none',
    }
  })

  // ============================================
  // Programmatic Animation Trigger
  // ============================================

  /**
   * Trigger exit animation programmatically (for button clicks).
   * Animates the current card out, calls the callback, then animates new card in.
   *
   * @param {'left'|'right'} direction - Direction to exit ('left' for next, 'right' for prev)
   * @param {Function} callback - Called after exit animation (typically: update card index)
   */
  const triggerExit = (direction, callback) => {
    isAnimatingOut.value = true
    swipeDirection.value = direction

    // After exit animation completes (200ms)
    setTimeout(() => {
      // Prepare entering state (card off-screen)
      isEntering.value = true

      // Call the navigation callback (e.g., increment index)
      callback?.()

      // Reset exit state
      isAnimatingOut.value = false
      offsetX.value = 0

      // On next frame, start enter animation
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isEntering.value = false
        })
      })
    }, 200)
  }

  // ============================================
  // VueUse Swipe Handler
  // ============================================

  /**
   * useSwipe from VueUse handles touch event detection.
   * We use passive: true for better scroll performance.
   */
  const { direction, lengthX } = useSwipe(target, {
    passive: true,

    /**
     * Called continuously during swipe.
     * Updates card position to follow finger.
     */
    onSwipe() {
      isSwiping.value = true
      // lengthX is negative when swiping left, so we negate it
      offsetX.value = -lengthX.value
    },

    /**
     * Called when swipe ends (finger lifted).
     * Either triggers navigation or snaps back to center.
     */
    onSwipeEnd() {
      isSwiping.value = false

      // Check if swipe exceeded threshold
      if (Math.abs(lengthX.value) >= threshold) {
        // Trigger exit animation
        isAnimatingOut.value = true
        swipeDirection.value = direction.value

        setTimeout(() => {
          // Prepare entering state
          isEntering.value = true

          // Call appropriate callback
          if (direction.value === 'left') {
            onSwipeLeft?.()
          } else if (direction.value === 'right') {
            onSwipeRight?.()
          }

          // Reset state
          isAnimatingOut.value = false
          offsetX.value = 0

          // Start enter animation
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isEntering.value = false
            })
          })
        }, 200)
      } else {
        // Snap back to center
        offsetX.value = 0
      }
    },
  })

  // ============================================
  // Return Public API
  // ============================================

  return {
    // VueUse swipe state
    direction,
    lengthX,

    // Animation styles (apply to element)
    cardStyle,

    // State flags
    isSwiping,
    isEntering,

    // Programmatic animation (for buttons)
    triggerExit
  }
}
