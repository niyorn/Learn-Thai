<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    required: true,
    validator: (value) => ['low', 'mid', 'high', 'short', 'long'].includes(value)
  },
  label: {
    type: String,
    required: true
  },
  showDot: {
    type: Boolean,
    default: false
  }
})

const colorClasses = computed(() => {
  const colors = {
    low: {
      bg: 'bg-coral-light',
      text: 'text-coral',
      dot: 'bg-coral'
    },
    mid: {
      bg: 'bg-amber-light',
      text: 'text-amber',
      dot: 'bg-amber-bright'
    },
    high: {
      bg: 'bg-azure-light',
      text: 'text-azure',
      dot: 'bg-azure'
    },
    short: {
      bg: 'bg-coral-light',
      text: 'text-coral',
      dot: 'bg-coral'
    },
    long: {
      bg: 'bg-azure-light',
      text: 'text-azure',
      dot: 'bg-azure'
    }
  }
  return colors[props.variant]
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold tracking-widest uppercase',
      colorClasses.bg,
      colorClasses.text
    ]"
  >
    <span
      v-if="showDot"
      :class="['w-1.5 h-1.5 rounded-full', colorClasses.dot]"
    />
    {{ label }}
  </span>
</template>
