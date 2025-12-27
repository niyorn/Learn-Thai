<script setup>
import { computed } from 'vue'

const props = defineProps({
  length: {
    type: String,
    required: true,
    validator: (value) => ['Short', 'Long'].includes(value),
  },
})

const isShort = computed(() => props.length === 'Short')
</script>

<template>
  <span
    :class="[
      'px-4 py-2 rounded text-xs font-semibold tracking-widest uppercase',
      isShort ? 'bg-coral-light text-coral' : 'bg-azure-light text-azure',
    ]"
  >
    {{ length }} vowel
  </span>
</template>
