<script setup>
import { consonantsData } from '@/data/consonants'
import FlashCardView from '@/components/flashcard/FlashCardView.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const filterOptions = [
  { value: 'essential', label: 'Essential · 23' },
  { value: 'secondary', label: 'Secondary · 8' }
]
</script>

<template>
  <FlashCardView
    title="Consonants"
    subtitle="พยัญชนะไทย"
    :data="consonantsData"
    :filter-options="filterOptions"
    default-filter="essential"
    thai-text-size="text-[120px] max-sm:text-[100px]"
  >
    <template #back="{ item }">
      <div class="font-display text-xl mb-1.5 opacity-95">
        {{ item.name }}
      </div>
      <div class="text-sm mb-4 opacity-70">
        {{ item.meaning }}
      </div>
      <div class="font-display text-4xl font-semibold mb-5">
        /{{ item.sound }}/
      </div>
      <BaseBadge
        :variant="item.class.toLowerCase()"
        :label="`${item.class} Class`"
        show-dot
      />
    </template>
  </FlashCardView>
</template>
