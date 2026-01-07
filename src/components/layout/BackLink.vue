<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  to: {
    type: String,
    default: '/'
  },
  label: {
    type: String,
    default: 'Back to Home'
  }
})
</script>

<template>
  <RouterLink
    :to="to"
    class="inline-flex items-center gap-2 text-ink-muted hover:text-azure transition-colors mb-6"
  >
    <svg
      class="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
    <span class="font-display text-sm">{{ label }}</span>
  </RouterLink>
</template>
