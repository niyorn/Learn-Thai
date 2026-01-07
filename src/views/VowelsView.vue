<script setup>
import { ref } from 'vue'
import { vowelsData } from '@/data/vowels'
import { useCardNavigation } from '@/composables/useCardNavigation'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import FlashCard from '@/components/FlashCard.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FilterButtonGroup from '@/components/flashcard/FilterButtonGroup.vue'
import CardNavigation from '@/components/flashcard/CardNavigation.vue'

const subSection = ref('essential')

const filterOptions = [
  { value: 'essential', label: 'Essential · 12' },
  { value: 'secondary', label: 'Secondary · 8' }
]

const { cardIndex, flipped, items, current, resetCard, nextCard, prevCard, toggleFlip } =
  useCardNavigation(() =>
    subSection.value === 'essential' ? vowelsData.essential : vowelsData.secondary
  )

const changeSubSection = (section) => {
  subSection.value = section
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
      title="Vowels"
      subtitle="สระไทย"
    />

    <FilterButtonGroup
      :options="filterOptions"
      :model-value="subSection"
      @update:model-value="changeSubSection"
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
        <span class="font-thai text-[100px] sm:text-[100px] max-sm:text-[80px] font-semibold text-ink leading-none">
          {{ current.thai }}
        </span>
        <div class="mt-5">
          <BaseSoundButton
            :text="current.example"
            size="lg"
          />
        </div>
        <p class="font-display text-ink-muted text-sm mt-4">
          tap to reveal
        </p>
      </template>

      <template #back>
        <div class="font-display text-4xl font-semibold mb-4">
          /{{ current.sound }}/
        </div>
        <BaseBadge
          :variant="current.length.toLowerCase()"
          :label="`${current.length} vowel`"
        />
        <div class="mt-5 px-5 py-3 bg-white/10 rounded flex items-center gap-3 flex-wrap justify-center">
          <span class="font-thai text-2xl">{{ current.example }}</span>
          <span class="opacity-50 text-base">—</span>
          <span class="font-display text-base">{{ current.exampleMeaning }}</span>
        </div>
      </template>
    </FlashCard>

    <CardNavigation
      @prev="prevCard"
      @next="nextCard"
    />
  </div>
</template>
