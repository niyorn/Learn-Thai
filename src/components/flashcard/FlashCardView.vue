<script setup>
import { ref, watch } from 'vue'
import { useCardNavigation } from '@/composables/useCardNavigation'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import FlashCard from '@/components/FlashCard.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FilterButtonGroup from '@/components/flashcard/FilterButtonGroup.vue'
import CardNavigation from '@/components/flashcard/CardNavigation.vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  data: {
    type: Object,
    required: true
  },
  filterOptions: {
    type: Array,
    required: true
  },
  defaultFilter: {
    type: String,
    required: true
  },
  soundTextField: {
    type: String,
    default: 'thai'
  },
  thaiTextSize: {
    type: String,
    default: 'text-[100px] max-sm:text-[80px]'
  }
})

const activeFilter = ref(props.defaultFilter)

const { cardIndex, flipped, items, current, resetCard, nextCard, prevCard, toggleFlip } =
  useCardNavigation(() => props.data[activeFilter.value] || [])

const changeFilter = (filter) => {
  activeFilter.value = filter
  resetCard()
}

useKeyboardNavigation({
  onNext: nextCard,
  onPrev: prevCard,
  onFlip: toggleFlip
})

// Expose current item and navigation for parent slots
defineExpose({
  current,
  cardIndex,
  flipped,
  items,
  nextCard,
  prevCard,
  toggleFlip
})
</script>

<template>
  <div class="px-4 py-8 max-w-xl mx-auto">
    <BackLink />

    <SectionHeader
      :title="title"
      :subtitle="subtitle"
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

    <FlashCard
      :flipped="flipped"
      @click="toggleFlip"
      @swipe-left="nextCard"
      @swipe-right="prevCard"
    >
      <template #front>
        <slot
          name="front"
          :item="current"
          :thai-text-size="thaiTextSize"
        >
          <span
            class="font-thai font-semibold text-ink leading-none"
            :class="thaiTextSize"
          >
            {{ current.thai }}
          </span>
        </slot>
        <div class="mt-5">
          <BaseSoundButton
            :text="current[soundTextField]"
            size="lg"
          />
        </div>
        <p class="font-display text-ink-muted text-sm mt-4">
          tap to reveal
        </p>
      </template>

      <template #back>
        <slot
          name="back"
          :item="current"
        />
      </template>
    </FlashCard>

    <CardNavigation
      @prev="prevCard"
      @next="nextCard"
    />
  </div>
</template>
