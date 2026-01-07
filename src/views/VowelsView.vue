<script setup>
import { ref, computed } from 'vue'
import { vowelsData } from '@/data/vowels'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import { useSwipeNavigation } from '@/composables/useSwipeNavigation'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FilterButtonGroup from '@/components/flashcard/FilterButtonGroup.vue'
import CardNavigation from '@/components/flashcard/CardNavigation.vue'

const filterOptions = [
  { value: 'essential', label: 'Essential · 12' },
  { value: 'secondary', label: 'Secondary · 8' }
]

const activeFilter = ref('essential')
const cardIndex = ref(0)
const cardRef = ref(null)

const items = computed(() => vowelsData[activeFilter.value] || [])
const current = computed(() => items.value[cardIndex.value] || {})

const changeFilter = (filter) => {
  activeFilter.value = filter
  cardIndex.value = 0
}

const nextCard = () => {
  if (cardIndex.value < items.value.length - 1) {
    cardIndex.value++
  }
}

const prevCard = () => {
  if (cardIndex.value > 0) {
    cardIndex.value--
  }
}

useKeyboardNavigation({
  onNext: nextCard,
  onPrev: prevCard,
  onFlip: () => {} // No flip needed
})

const { cardStyle, triggerExit } = useSwipeNavigation(cardRef, {
  onSwipeLeft: nextCard,
  onSwipeRight: prevCard
})

const animateNext = () => {
  if (cardIndex.value < items.value.length - 1) {
    triggerExit('left', nextCard)
  }
}

const animatePrev = () => {
  if (cardIndex.value > 0) {
    triggerExit('right', prevCard)
  }
}

// Format Thai text to style the dotted circle placeholder
const formatVowel = (text) => {
  return text.replace(/◌/g, '<span class="vowel-placeholder">◌</span>')
}
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
      :model-value="activeFilter"
      @update:model-value="changeFilter"
    />

    <ProgressBar
      :current="cardIndex"
      :total="items.length"
    />

    <!-- Single card showing all info -->
    <div
      ref="cardRef"
      class="w-full max-w-[440px] mx-auto touch-pan-y select-none"
      :style="cardStyle"
    >
      <div class="bg-paper border border-gold-light rounded-lg shadow-soft p-6">
        <!-- Vowel character with sound -->
        <div class="flex flex-col items-center mb-6">
          <span
            class="font-thai font-semibold text-ink leading-none text-[80px] max-sm:text-[64px]"
            v-html="formatVowel(current.thai)"
          />
          <div class="flex items-center gap-3 mt-4">
            <BaseSoundButton
              :text="current.sample"
              size="md"
            />
            <span class="font-display text-2xl font-semibold text-ink">
              /{{ current.sound }}/
            </span>
            <BaseBadge
              :variant="current.length?.toLowerCase()"
              :label="current.length"
            />
          </div>
        </div>

        <!-- Divider -->
        <div class="border-t border-gold-light my-4" />

        <!-- Example word section -->
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <BaseSoundButton
            :text="current.example"
            size="sm"
          />
          <span class="font-thai text-3xl text-ink">{{ current.example }}</span>
          <span class="text-ink-muted">—</span>
          <span class="font-display text-lg text-ink-light">{{ current.exampleMeaning }}</span>
        </div>
      </div>
    </div>

    <CardNavigation
      @prev="animatePrev"
      @next="animateNext"
    />
  </div>
</template>
