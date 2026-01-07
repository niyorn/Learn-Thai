<script setup>
import BaseArrowButton from '@/components/BaseArrowButton.vue'

defineEmits(['prev', 'next'])
</script>

<template>
  <div class="flex gap-4 justify-center items-center mt-8">
    <BaseArrowButton
      direction="left"
      @click="$emit('prev')"
    />
    <BaseArrowButton
      direction="right"
      @click="$emit('next')"
    />
  </div>
</template>
