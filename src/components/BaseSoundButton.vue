<script setup>
import { useSpeech } from '@/composables/useSpeech'

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },
})

const { isPlaying, speak } = useSpeech()

const sizeClasses = {
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
}

const iconSizes = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
}

const handleClick = (event) => {
  event.stopPropagation()
  speak(props.text)
}
</script>

<template>
  <button
    :class="[
      sizeClasses[size],
      'flex items-center justify-center rounded-full border-2 border-azure cursor-pointer transition-all duration-300',
      isPlaying ? 'bg-azure text-paper scale-95' : 'bg-transparent text-azure',
    ]"
    @click="handleClick"
  >
    <svg
      :class="iconSizes[size]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  </button>
</template>
