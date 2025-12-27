<script setup>
defineProps({
  direction: {
    type: String,
    required: true,
    validator: (value) => ['left', 'right'].includes(value),
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="flex items-center justify-center w-13 h-13 border border-gold-light rounded-full bg-paper text-ink-light cursor-pointer transition-all duration-300 shadow-soft hover:border-azure hover:text-azure"
    @click="$emit('click')"
  >
    <svg
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline :points="direction === 'left' ? '15 18 9 12 15 6' : '9 18 15 12 9 6'" />
    </svg>
  </button>
</template>
