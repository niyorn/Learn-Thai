<script setup>
/**
 * ConsonantsView - Thai consonants learning page
 *
 * Displays Thai consonants in a swipeable card format with:
 * - Essential (23) and Secondary (8) consonant sets
 * - Swipe gestures for navigation
 * - Keyboard navigation (arrow keys)
 * - Audio pronunciation
 *
 * Uses useSwipeableCard composable for all navigation logic.
 */
import { ref, computed } from 'vue'
import { consonantsData } from '@/data/consonants'
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
 * Available consonant categories with their labels.
 * Used by FilterButtonGroup component.
 */
const filterOptions = [
  { value: 'essential', label: 'Essential · 23' },
  { value: 'secondary', label: 'Secondary · 8' }
]

/**
 * Currently active filter.
 * Controls which consonant set is displayed.
 */
const activeFilter = ref('essential')

// ============================================
// Card Navigation Setup
// ============================================

/**
 * useSwipeableCard provides all navigation logic:
 * - cardRef: attach to swipeable element
 * - cardStyle: CSS for swipe animations
 * - current: current consonant object
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
  () => consonantsData[activeFilter.value] || []
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
        <!-- Consonant Character & Sound -->
        <div class="flex flex-col items-center mb-4">
          <span class="font-thai font-semibold text-ink leading-none text-[100px] max-sm:text-[80px]">
            {{ current.thai }}
          </span>
          <div class="flex items-center gap-3 mt-3">
            <BaseSoundButton
              :text="current.nameThai"
              size="md"
            />
            <span class="font-display text-2xl font-semibold text-ink">
              /{{ current.sound }}/
            </span>
            <BaseBadge
              :variant="current.class?.toLowerCase()"
              :label="current.class"
              show-dot
            />
          </div>
        </div>

        <!-- Consonant Name & Meaning -->
        <div class="text-center mb-4">
          <div class="font-display text-lg text-ink">
            {{ current.name }}
          </div>
          <div class="text-sm text-ink-muted">
            "{{ current.meaning }}"
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
