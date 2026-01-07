<script setup>
import { vowelsData } from '@/data/vowels'
import FlashCardView from '@/components/flashcard/FlashCardView.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const filterOptions = [
  { value: 'essential', label: 'Essential · 12' },
  { value: 'secondary', label: 'Secondary · 8' }
]
</script>

<template>
  <FlashCardView
    title="Vowels"
    subtitle="สระไทย"
    :data="vowelsData"
    :filter-options="filterOptions"
    default-filter="essential"
    sound-text-field="example"
    thai-text-size="text-[100px] max-sm:text-[80px]"
  >
    <template #back="{ item }">
      <div class="font-display text-4xl font-semibold mb-4">
        /{{ item.sound }}/
      </div>
      <BaseBadge
        :variant="item.length.toLowerCase()"
        :label="`${item.length} vowel`"
      />
      <div class="mt-5 px-5 py-3 bg-white/10 rounded flex items-center gap-3 flex-wrap justify-center">
        <span class="font-thai text-2xl">{{ item.example }}</span>
        <span class="opacity-50 text-base">—</span>
        <span class="font-display text-base">{{ item.exampleMeaning }}</span>
      </div>
    </template>
  </FlashCardView>
</template>
