<script setup>
/**
 * VowelsView - Thai vowels learning page
 *
 * Displays Thai vowels in a swipeable card format with:
 * - Essential (12) and Secondary (8) vowel sets
 * - Swipe gestures for navigation
 * - Keyboard navigation (arrow keys)
 * - Audio pronunciation
 * - Dotted circle placeholder styling for vowel position
 *
 * Uses useSwipeableCard composable for all navigation logic.
 */
import { ref } from 'vue'
import { vowelsData } from '@/data/vowels'
import { useSwipeableCard } from '@/composables/useSwipeableCard'
import BaseBadge from '@/components/base/BaseBadge.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FilterButtonGroup from '@/components/flashcard/FilterButtonGroup.vue'
import CardNavigation from '@/components/flashcard/CardNavigation.vue'

// ============================================
// Filter Configuration
// ============================================

/**
 * Available vowel categories with their labels.
 * Used by FilterButtonGroup component.
 */
const filterOptions = [
  { value: 'essential', label: 'Essential · 12' },
  { value: 'secondary', label: 'Secondary · 8' }
]

/**
 * Currently active filter.
 * Controls which vowel set is displayed.
 */
const activeFilter = ref('essential')

// ============================================
// Card Navigation Setup
// ============================================

/**
 * useSwipeableCard provides all navigation logic:
 * - cardRef: attach to swipeable element
 * - cardStyle: CSS for swipe animations
 * - current: current vowel object
 * - animateNext/animatePrev: for button clicks
 * - resetCard: called when filter changes
 *
 * The itemsGetter function is reactive - when activeFilter
 * changes, items automatically update.
 */
const {
  cardRef,
  cardIndex,
  items,
  current,
  cardStyle,
  animateNext,
  animatePrev,
  resetCard
} = useSwipeableCard(
  () => vowelsData[activeFilter.value] || []
)

// ============================================
// Filter Change Handler
// ============================================

/**
 * Handle filter category change.
 * Resets to first card when switching between essential/secondary.
 */
const changeFilter = (filter) => {
  activeFilter.value = filter
  resetCard()
}

// ============================================
// Vowel Display Helpers
// ============================================

/**
 * Format Thai vowel text with styled placeholder.
 * The dotted circle (◌) indicates consonant position in Thai vowels.
 * This wraps it in a span for visual distinction.
 *
 * @param {string} text - Thai vowel text with ◌ placeholder
 * @returns {string} HTML string with styled placeholder
 */
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

    <!-- Swipeable Card Container -->
    <div
      ref="cardRef"
      class="w-full max-w-[440px] mx-auto touch-pan-y select-none"
      :style="cardStyle"
    >
      <div class="bg-paper border border-gold-light rounded-lg shadow-soft p-6">
        <!-- Vowel Character & Sound -->
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

        <div class="border-t border-gold-light my-4" />

        <!-- Example Word -->
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

    <!-- Navigation Buttons -->
    <CardNavigation
      @prev="animatePrev"
      @next="animateNext"
    />
  </div>
</template>
