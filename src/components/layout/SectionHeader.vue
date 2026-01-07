<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="thai-border text-center mb-8 pt-6">
    <h2 class="font-display text-3xl font-semibold text-ink mb-2">
      {{ title }}
    </h2>
    <p
      v-if="subtitle"
      class="font-thai text-ink-muted text-base"
    >
      {{ subtitle }}
    </p>
  </div>
</template>
