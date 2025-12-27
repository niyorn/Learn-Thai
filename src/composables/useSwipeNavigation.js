import { useSwipe } from '@vueuse/core'

/**
 * Composable for handling swipe navigation on flashcards
 * @param {Ref<HTMLElement>} target - Element to attach swipe listeners to
 * @param {Object} options - Navigation callbacks
 * @param {Function} options.onSwipeLeft - Called when user swipes left (next card)
 * @param {Function} options.onSwipeRight - Called when user swipes right (previous card)
 * @param {number} [options.threshold=50] - Minimum swipe distance in pixels
 */
export function useSwipeNavigation(target, { onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const { direction, lengthX } = useSwipe(target, {
    passive: true,
    onSwipeEnd() {
      if (Math.abs(lengthX.value) < threshold) return

      if (direction.value === 'left') {
        onSwipeLeft?.()
      } else if (direction.value === 'right') {
        onSwipeRight?.()
      }
    },
  })

  return { direction, lengthX }
}
