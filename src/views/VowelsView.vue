<script setup>
import { vowelsData } from '@/data/vowels'
import FlashCardView from '@/components/flashcard/FlashCardView.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'

const filterOptions = [
  { value: 'essential', label: 'Essential · 12' },
  { value: 'secondary', label: 'Secondary · 8' }
]

// Format Thai text to style the dotted circle placeholder
const formatVowel = (text) => {
  return text.replace(/◌/g, '<span class="vowel-placeholder">◌</span>')
}
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
    <template #front="{ item, thaiTextSize }">
      <span
        class="font-thai font-semibold text-ink leading-none"
        :class="thaiTextSize"
        v-html="formatVowel(item.thai)"
      />
    </template>

    <template #back="{ item }">
      <!-- Vowel sound with pronunciation -->
      <div class="flex items-center gap-3 mb-4">
        <BaseSoundButton
          :text="item.sample"
          size="md"
          variant="light"
        />
        <div class="font-display text-4xl font-semibold">
          /{{ item.sound }}/
        </div>
      </div>

      <BaseBadge
        :variant="item.length.toLowerCase()"
        :label="`${item.length} vowel`"
      />

      <!-- Example word with sound -->
      <div class="mt-5 px-5 py-3 bg-white/10 rounded flex items-center gap-3 flex-wrap justify-center">
        <BaseSoundButton
          :text="item.example"
          size="sm"
          variant="light"
        />
        <span class="font-thai text-2xl">{{ item.example }}</span>
        <span class="opacity-50 text-base">—</span>
        <span class="font-display text-base">{{ item.exampleMeaning }}</span>
      </div>
    </template>
  </FlashCardView>
</template>
