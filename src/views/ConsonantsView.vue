<script setup>
import { ref } from 'vue'
import { consonantsData } from '@/data/consonants'
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
  { value: 'essential', label: 'Essential · 23' },
  { value: 'secondary', label: 'Secondary · 8' }
]

const { cardIndex, flipped, items, current, resetCard, nextCard, prevCard, toggleFlip } =
  useCardNavigation(() =>
    subSection.value === 'essential' ? consonantsData.essential : consonantsData.secondary
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
      title="Consonants"
      subtitle="พยัญชนะไทย"
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
        <span class="font-thai text-[120px] sm:text-[120px] max-sm:text-[100px] font-semibold text-ink leading-none">
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
        <div class="font-display text-xl mb-1.5 opacity-95">
          {{ current.name }}
        </div>
        <div class="text-sm mb-4 opacity-70">
          {{ current.meaning }}
        </div>
        <div class="font-display text-4xl font-semibold mb-5">
          /{{ current.sound }}/
        </div>
        <BaseBadge
          :variant="current.class.toLowerCase()"
          :label="`${current.class} Class`"
          show-dot
        />
      </template>
    </FlashCard>

    <CardNavigation
      @prev="prevCard"
      @next="nextCard"
    />
  </div>
</template>
