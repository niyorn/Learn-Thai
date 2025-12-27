<script setup>
import { computed } from 'vue'

const props = defineProps({
  classType: {
    type: String,
    required: true,
    validator: (value) => ['Low', 'Mid', 'High'].includes(value),
  },
})

const colorClasses = computed(() => {
  const colors = {
    Low: {
      bg: 'bg-coral-light',
      text: 'text-coral',
      dot: 'bg-coral',
    },
    Mid: {
      bg: 'bg-amber-light',
      text: 'text-amber',
      dot: 'bg-amber-bright',
    },
    High: {
      bg: 'bg-azure-light',
      text: 'text-azure',
      dot: 'bg-azure',
    },
  }
  return colors[props.classType]
})
</script>

<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold tracking-widest uppercase',
      colorClasses.bg,
      colorClasses.text,
    ]"
  >
    <span :class="['w-1.5 h-1.5 rounded-full', colorClasses.dot]" />
    {{ classType }} Class
  </span>
</template>
