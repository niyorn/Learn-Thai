import { ref, computed } from 'vue'
import { useSwipe } from '@vueuse/core'

/**
 * Composable for handling swipe navigation with Tinder-like animation
 * @param {Ref<HTMLElement>} target - Element to attach swipe listeners to
 * @param {Object} options - Navigation callbacks
 * @param {Function} options.onSwipeLeft - Called when user swipes left (next card)
 * @param {Function} options.onSwipeRight - Called when user swipes right (previous card)
 * @param {number} [options.threshold=80] - Minimum swipe distance to trigger navigation
 */
export function useSwipeNavigation(target, { onSwipeLeft, onSwipeRight, threshold = 80 }) {
  const isSwiping = ref(false)
  const isAnimatingOut = ref(false)
  const isEntering = ref(false)
  const swipeDirection = ref(null)
  const offsetX = ref(0)

  const rotation = computed(() => offsetX.value * 0.1)
  const opacity = computed(() => Math.max(0.5, 1 - Math.abs(offsetX.value) / 300))

  const cardStyle = computed(() => {
    // Card entering from opposite side of swipe direction
    if (isEntering.value) {
      // Swipe left = next card enters from right, swipe right = prev card enters from left
      const enterX = swipeDirection.value === 'left' ? 350 : -350
      return {
        transform: `translateX(${enterX}px) rotate(${enterX * 0.1}deg)`,
        opacity: 0,
        transition: 'none',
      }
    }
    // Card exiting
    if (isAnimatingOut.value) {
      const exitX = swipeDirection.value === 'left' ? -350 : 350
      return {
        transform: `translateX(${exitX}px) rotate(${exitX * 0.1}deg)`,
        opacity: 0,
        transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
      }
    }
    // Card at rest
    if (!isSwiping.value) {
      return {
        transform: 'translateX(0) rotate(0deg)',
        opacity: 1,
        transition: 'transform 0.2s ease-out, opacity 0.2s ease-out',
      }
    }
    // Card being dragged
    return {
      transform: `translateX(${offsetX.value}px) rotate(${rotation.value}deg)`,
      opacity: opacity.value,
      transition: 'none',
    }
  })

  // Trigger exit animation programmatically (for button clicks)
  const triggerExit = (direction, callback) => {
    isAnimatingOut.value = true
    swipeDirection.value = direction

    setTimeout(() => {
      isEntering.value = true
      callback?.()
      isAnimatingOut.value = false
      offsetX.value = 0

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          isEntering.value = false
        })
      })
    }, 200)
  }

  const { direction, lengthX } = useSwipe(target, {
    passive: true,
    onSwipe() {
      isSwiping.value = true
      offsetX.value = -lengthX.value
    },
    onSwipeEnd() {
      isSwiping.value = false

      if (Math.abs(lengthX.value) >= threshold) {
        isAnimatingOut.value = true
        swipeDirection.value = direction.value

        setTimeout(() => {
          isEntering.value = true

          if (direction.value === 'left') {
            onSwipeLeft?.()
          } else if (direction.value === 'right') {
            onSwipeRight?.()
          }

          isAnimatingOut.value = false
          offsetX.value = 0

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isEntering.value = false
            })
          })
        }, 200)
      } else {
        offsetX.value = 0
      }
    },
  })

  return { direction, lengthX, cardStyle, isSwiping, isEntering, triggerExit }
}
