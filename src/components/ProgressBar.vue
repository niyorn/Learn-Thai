<script setup>
import { computed } from 'vue'

const props = defineProps({
  current: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
})

const progressPercent = computed(() => ((props.current + 1) / props.total) * 100)
</script>

<template>
  <div class="flex items-center gap-4 mb-8">
    <div class="flex-1 h-0.5 bg-gold-light rounded-sm overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-azure to-azure-bright transition-all duration-400 ease-out"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>
    <span class="font-display text-ink-muted text-sm min-w-12 text-right">
      {{ current + 1 }} of {{ total }}
    </span>
  </div>
</template>
