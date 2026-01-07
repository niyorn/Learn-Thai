import { useEventListener } from '@vueuse/core'

/**
 * Composable for handling keyboard navigation on flashcards
 * @param {Object} options - Navigation callbacks
 * @param {Function} options.onNext - Called when right arrow is pressed
 * @param {Function} options.onPrev - Called when left arrow is pressed
 * @param {Function} options.onFlip - Called when spacebar is pressed
 */
export function useKeyboardNavigation({ onNext, onPrev, onFlip }) {
  useEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') onNext()
    if (event.key === 'ArrowLeft') onPrev()
    if (event.key === ' ') {
      event.preventDefault()
      onFlip()
    }
  })
}
