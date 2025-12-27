<script setup>
defineProps({
  active: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    :class="[
      'px-5 py-2.5 rounded-3xl font-medium text-sm tracking-wide cursor-pointer transition-all duration-300',
      active
        ? 'border border-azure bg-azure text-paper'
        : 'border border-gold-light bg-transparent text-ink-light hover:border-azure hover:text-azure',
    ]"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>
