<script setup>
import { wordsData, wordCategories } from '@/data/words'
import FlashCardView from '@/components/flashcard/FlashCardView.vue'

const filterOptions = wordCategories.map(cat => ({
  value: cat.key,
  label: cat.label
}))
</script>

<template>
  <FlashCardView
    title="Vocabulary"
    subtitle="คำศัพท์"
    :data="wordsData"
    :filter-options="filterOptions"
    default-filter="pronouns"
    thai-text-size="text-[72px] max-sm:text-[56px]"
  >
    <template #back="{ item }">
      <div class="text-base mb-3 opacity-70 tracking-wide">
        {{ item.translit }}
      </div>
      <div class="font-display text-4xl font-semibold">
        {{ item.meaning }}
      </div>
    </template>
  </FlashCardView>
</template>
