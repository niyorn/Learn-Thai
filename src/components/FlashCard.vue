<script setup>
import { ref, computed } from 'vue'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'

const props = defineProps({
  flipped: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    default: 'navigate',
    validator: (value) => ['navigate', 'answer'].includes(value),
  },
})

const emit = defineEmits(['click', 'swipe-left', 'swipe-right', 'answer-correct', 'answer-incorrect'])

const cardRef = ref(null)

const swipeEnabled = computed(() => {
  return true
})

const { cardStyle, isSwiping } = useSwipeNavigation(cardRef, {
  onSwipeLeft: () => {
    if (!swipeEnabled.value) return
    if (props.mode === 'answer') {
      emit('answer-incorrect')
    } else {
      emit('swipe-left')
    }
  },
  onSwipeRight: () => {
    if (!swipeEnabled.value) return
    if (props.mode === 'answer') {
      emit('answer-correct')
    } else {
      emit('swipe-right')
    }
  },
})

const handleClick = () => {
  if (!isSwiping.value) {
    emit('click')
  }
}
</script>

<template>
  <div
    ref="cardRef"
    class="w-full max-w-[440px] h-80 cursor-pointer mx-auto touch-pan-y select-none"
    style="perspective: 1200px"
    @click="handleClick"
  >
    <div
      :class="['card-flip relative w-full h-full', { flipped }]"
      :style="cardStyle"
    >
      <!-- Front -->
      <div
        class="card-face paper-texture lotus-corners absolute inset-0 bg-paper border border-gold-light rounded flex flex-col items-center justify-center p-10 shadow-soft"
      >
        <slot name="front" />
      </div>

      <!-- Back -->
      <div
        class="card-face card-back absolute inset-0 bg-gradient-to-br from-azure to-[#1E3A8A] rounded flex flex-col items-center justify-center p-10 shadow-lifted text-paper"
      >
        <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-azure-bright via-[#60A5FA] to-azure-bright" />
        <slot name="back" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 640px) {
  .h-80 {
    height: 280px;
  }
}
</style>
