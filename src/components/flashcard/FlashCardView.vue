<script setup>
/**
 * FlashCardView - Generic flashcard component with flip animation
 *
 * A reusable wrapper for flashcard-based learning pages that provides:
 * - Flip card with front/back slots
 * - Swipe gestures for navigation (handled by FlashCard component)
 * - Keyboard navigation (arrow keys + spacebar for flip)
 * - Animated button navigation
 * - Filter/category support
 * - Progress tracking
 *
 * ARCHITECTURE NOTE:
 * Unlike ConsonantsView/VowelsView which use useSwipeableCard directly,
 * this component uses the FlashCard component which has its own internal
 * swipe handling via useSwipeNavigation. This separation exists because:
 *
 * 1. FlashCard needs to manage both flip AND swipe animations on the same element
 * 2. The 3D flip transform requires the swipe styles to be applied to the card-flip div
 * 3. FlashCard exposes animateOut() for button-triggered animations
 *
 * For simpler non-flip cards, use useSwipeableCard composable directly.
 *
 * @example
 * <FlashCardView
 *   title="Vocabulary"
 *   subtitle="คำศัพท์"
 *   :data="wordsData"
 *   :filter-options="filterOptions"
 *   default-filter="pronouns"
 * >
 *   <template #back="{ item }">
 *     {{ item.meaning }}
 *   </template>
 * </FlashCardView>
 */
import { ref } from 'vue'
import { useCardNavigation } from '@/composables/useCardNavigation'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import FlashCard from '@/components/FlashCard.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FilterButtonGroup from '@/components/flashcard/FilterButtonGroup.vue'
import CardNavigation from '@/components/flashcard/CardNavigation.vue'

// ============================================
// Props
// ============================================

const props = defineProps({
  /**
   * Page title displayed in the header
   */
  title: {
    type: String,
    required: true
  },

  /**
   * Thai subtitle displayed below the title
   */
  subtitle: {
    type: String,
    default: ''
  },

  /**
   * Data object with category keys mapping to item arrays
   * @example { pronouns: [...], verbs: [...] }
   */
  data: {
    type: Object,
    required: true
  },

  /**
   * Filter button options
   * @example [{ value: 'pronouns', label: 'Pronouns' }]
   */
  filterOptions: {
    type: Array,
    required: true
  },

  /**
   * Initial filter selection (must match a filterOptions value)
   */
  defaultFilter: {
    type: String,
    required: true
  },

  /**
   * Item field to use for sound button text
   * @default 'thai'
   */
  soundTextField: {
    type: String,
    default: 'thai'
  },

  /**
   * Tailwind classes for Thai character size
   * @default 'text-[100px] max-sm:text-[80px]'
   */
  thaiTextSize: {
    type: String,
    default: 'text-[100px] max-sm:text-[80px]'
  }
})

// ============================================
// Filter State
// ============================================

/**
 * Currently active filter category.
 * Controls which data set is displayed.
 */
const activeFilter = ref(props.defaultFilter)

// ============================================
// FlashCard Reference
// ============================================

/**
 * Reference to the FlashCard component.
 * Used to call animateOut() for button-triggered animations.
 *
 * FlashCard exposes:
 * - animateOut(direction, callback) - triggers exit animation then calls callback
 */
const flashCardRef = ref(null)

// ============================================
// Card Navigation
// ============================================

/**
 * useCardNavigation provides state and methods for flip cards:
 * - cardIndex: current position in the deck
 * - flipped: whether card is showing back side
 * - items: computed array from current filter
 * - current: current item object
 * - resetCard: reset to first card (used on filter change)
 * - nextCard/prevCard: navigation with flip reset
 * - toggleFlip: flip the current card
 *
 * Note: nextCard/prevCard include a 150ms delay for flip animation
 * and wrap around (last → first, first → last).
 */
const {
  cardIndex,
  flipped,
  items,
  current,
  resetCard,
  nextCard,
  prevCard,
  toggleFlip
} = useCardNavigation(() => props.data[activeFilter.value] || [])

// ============================================
// Animated Navigation (For Buttons)
// ============================================

/**
 * Navigate to next card with exit animation.
 * Calls FlashCard's animateOut which:
 * 1. Animates card exiting to the left
 * 2. Calls nextCard callback after animation
 * 3. Animates new card entering from the right
 *
 * Only triggers if not at the last card.
 */
const animateNext = () => {
  if (cardIndex.value < items.value.length - 1) {
    flashCardRef.value?.animateOut('left', nextCard)
  }
}

/**
 * Navigate to previous card with exit animation.
 * Calls FlashCard's animateOut which:
 * 1. Animates card exiting to the right
 * 2. Calls prevCard callback after animation
 * 3. Animates new card entering from the left
 *
 * Only triggers if not at the first card.
 */
const animatePrev = () => {
  if (cardIndex.value > 0) {
    flashCardRef.value?.animateOut('right', prevCard)
  }
}

// ============================================
// Filter Change Handler
// ============================================

/**
 * Handle filter category change.
 * Resets to first card when switching categories.
 */
const changeFilter = (filter) => {
  activeFilter.value = filter
  resetCard()
}

// ============================================
// Keyboard Navigation
// ============================================

/**
 * Enable keyboard shortcuts:
 * - ArrowRight: next card
 * - ArrowLeft: previous card
 * - Spacebar: flip card
 */
useKeyboardNavigation({
  onNext: nextCard,
  onPrev: prevCard,
  onFlip: toggleFlip
})

// ============================================
// Expose for Parent Components
// ============================================

/**
 * Expose state and methods for parent component access.
 * Allows parent to read current item in slot props.
 */
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

    <!--
      FlashCard Component
      - Handles swipe gestures internally via useSwipeNavigation
      - Exposes animateOut() for button-triggered animations
      - Emits swipe-left/swipe-right when swipe threshold is reached
      - Emits click for flip toggle (only if not swiping)
    -->
    <FlashCard
      ref="flashCardRef"
      :flipped="flipped"
      @click="toggleFlip"
      @swipe-left="nextCard"
      @swipe-right="prevCard"
    >
      <!-- Front of Card -->
      <template #front>
        <slot
          name="front"
          :item="current"
          :thai-text-size="thaiTextSize"
        >
          <!-- Default front: Thai character -->
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

      <!-- Back of Card -->
      <template #back>
        <slot
          name="back"
          :item="current"
        />
      </template>
    </FlashCard>

    <!-- Navigation Buttons -->
    <CardNavigation
      @prev="animatePrev"
      @next="animateNext"
    />
  </div>
</template>
