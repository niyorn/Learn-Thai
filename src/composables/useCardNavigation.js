import { ref, computed } from 'vue'

/**
 * Composable for managing flashcard navigation state and actions
 * @param {Function} itemsGetter - Function that returns the current array of items
 * @returns {Object} Navigation state and methods
 */
export function useCardNavigation(itemsGetter) {
  const cardIndex = ref(0)
  const flipped = ref(false)

  const items = computed(() => itemsGetter())
  const current = computed(() => items.value[cardIndex.value])
  const total = computed(() => items.value.length)

  const resetCard = () => {
    cardIndex.value = 0
    flipped.value = false
  }

  const nextCard = () => {
    flipped.value = false
    setTimeout(() => {
      cardIndex.value = (cardIndex.value + 1) % items.value.length
    }, 150)
  }

  const prevCard = () => {
    flipped.value = false
    setTimeout(() => {
      cardIndex.value = (cardIndex.value - 1 + items.value.length) % items.value.length
    }, 150)
  }

  const toggleFlip = () => {
    flipped.value = !flipped.value
  }

  return {
    cardIndex,
    flipped,
    items,
    current,
    total,
    resetCard,
    nextCard,
    prevCard,
    toggleFlip
  }
}
