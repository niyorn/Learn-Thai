<script setup>
import BasePillButton from '@/components/BasePillButton.vue'

defineProps({
  options: {
    type: Array,
    required: true
    // [{ value: 'essential', label: 'Essential · 23' }]
  },
  modelValue: {
    type: String,
    required: true
  }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex gap-2 justify-center mb-8 flex-wrap">
    <BasePillButton
      v-for="option in options"
      :key="option.value"
      :active="modelValue === option.value"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
    </BasePillButton>
  </div>
</template>
