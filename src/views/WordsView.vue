<script setup>
import { ref } from 'vue'
import { wordsData, wordCategories } from '@/data/words'
import { useCardNavigation } from '@/composables/useCardNavigation'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import FlashCard from '@/components/FlashCard.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FilterButtonGroup from '@/components/flashcard/FilterButtonGroup.vue'
import CardNavigation from '@/components/flashcard/CardNavigation.vue'

const wordCategory = ref('pronouns')

const filterOptions = wordCategories.map(cat => ({
  value: cat.key,
  label: cat.label
}))

const { cardIndex, flipped, items, current, resetCard, nextCard, prevCard, toggleFlip } =
  useCardNavigation(() => wordsData[wordCategory.value])

const changeCategory = (category) => {
  wordCategory.value = category
  resetCard()
}

useKeyboardNavigation({
  onNext: nextCard,
  onPrev: prevCard,
  onFlip: toggleFlip
})
</script>

<template>
  <div class="px-4 py-8 max-w-xl mx-auto">
    <BackLink />

    <SectionHeader
      title="Vocabulary"
      subtitle="คำศัพท์"
    />

    <FilterButtonGroup
      :options="filterOptions"
      :model-value="wordCategory"
      @update:model-value="changeCategory"
    />

    <ProgressBar
      :current="cardIndex"
      :total="items.length"
    />

    <FlashCard
      :flipped="flipped"
      @click="toggleFlip"
      @swipe-left="nextCard"
      @swipe-right="prevCard"
    >
      <template #front>
        <span class="font-thai text-[72px] sm:text-[72px] max-sm:text-[56px] font-semibold text-ink leading-none">
          {{ current.thai }}
        </span>
        <div class="mt-5">
          <BaseSoundButton
            :text="current.thai"
            size="lg"
          />
        </div>
        <p class="font-display text-ink-muted text-sm mt-4">
          tap to reveal
        </p>
      </template>

      <template #back>
        <div class="text-base mb-3 opacity-70 tracking-wide">
          {{ current.translit }}
        </div>
        <div class="font-display text-4xl font-semibold">
          {{ current.meaning }}
        </div>
      </template>
    </FlashCard>

    <CardNavigation
      @prev="prevCard"
      @next="nextCard"
    />
  </div>
</template>
