# Learn Thai - Modularity Refactor Plan

## Overview

This plan restructures the codebase for better modularity, reduced code duplication, and improved maintainability. The biggest issue is **~80% code duplication across 3 view files**.

---

## Current vs. Proposed Structure

### Current Structure
```
src/
├── components/          # 8 components (some duplication)
├── composables/         # 2 composables (missing key ones)
├── data/               # 3 data files (inconsistent schema)
├── views/              # 5 views (~465 LOC duplicated)
└── assets/
```

### Proposed Structure
```
src/
├── components/
│   ├── base/                    # Generic reusable components
│   │   ├── BaseArrowButton.vue
│   │   ├── BaseBadge.vue        # NEW: Generic badge (replaces Class/Length)
│   │   ├── BaseIcon.vue         # NEW: SVG icon library
│   │   ├── BasePillButton.vue
│   │   └── BaseSoundButton.vue
│   ├── flashcard/               # NEW: Flashcard-specific components
│   │   ├── FlashCard.vue
│   │   ├── CardNavigation.vue   # NEW: Arrow buttons wrapper
│   │   └── FilterButtonGroup.vue # NEW: Category/section filters
│   ├── layout/                  # NEW: Layout components
│   │   ├── BackLink.vue         # NEW: "Back to Home" link
│   │   ├── SectionHeader.vue    # NEW: Page title/subtitle
│   │   └── TheNavbar.vue
│   └── practice/                # NEW: Practice-specific components
│       ├── AnswerButtons.vue    # NEW: Know/Don't know buttons
│       ├── PracticeStats.vue    # NEW: Stats display
│       └── ProgressBar.vue
├── composables/
│   ├── useCardNavigation.js     # NEW: Card index, flip, next/prev
│   ├── useKeyboardNavigation.js # NEW: Arrow keys, spacebar
│   ├── usePracticeState.js      # NEW: Practice scoring/deck
│   ├── useSpeech.js
│   └── useSwipeNavigation.js
├── data/
│   ├── config.js                # NEW: Category metadata
│   ├── consonants.js
│   ├── vowels.js
│   └── words.js
├── views/
│   ├── HomeView.vue
│   ├── FlashCardView.vue        # NEW: Generic view (replaces 3 views)
│   └── PracticeView.vue         # Simplified with composables
└── assets/
```

---

## Phase 1: Extract Core Composables (Priority: Critical) ✅ COMPLETED

> **Status:** Completed on 2026-01-07
>
> **Changes Made:**
> - Created `src/composables/useCardNavigation.js`
> - Created `src/composables/useKeyboardNavigation.js`
> - Updated `ConsonantsView.vue` to use new composables (reduced from 60 LOC to 30 LOC)
> - Updated `VowelsView.vue` to use new composables (reduced from 60 LOC to 30 LOC)
> - Updated `WordsView.vue` to use new composables (reduced from 57 LOC to 27 LOC)
>
> **Result:** ~90 LOC eliminated through extraction of shared logic
>
> **Testing (Playwriter MCP):** ✅ All tests passed
> - Consonants page loads correctly
> - Arrow key navigation works (ArrowRight/ArrowLeft)
> - Spacebar flip works
> - Vowels page loads correctly
> - Words page loads correctly
> - Category switching resets card index properly

### 1.1 Create `useCardNavigation.js`

**Why:** Eliminates ~150 LOC of duplicated logic across 3 views.

```javascript
// src/composables/useCardNavigation.js
import { ref, computed } from 'vue'

export function useCardNavigation(itemsGetter) {
  const cardIndex = ref(0)
  const flipped = ref(false)

  const items = computed(() => itemsGetter())
  const current = computed(() => items.value[cardIndex.value])
  const total = computed(() => items.value.length)

  const resetCard = () => {
    cardIndex.value = 0
    flipped.value = false
  }

  const nextCard = () => {
    flipped.value = false
    setTimeout(() => {
      cardIndex.value = (cardIndex.value + 1) % items.value.length
    }, 150)
  }

  const prevCard = () => {
    flipped.value = false
    setTimeout(() => {
      cardIndex.value = (cardIndex.value - 1 + items.value.length) % items.value.length
    }, 150)
  }

  const toggleFlip = () => {
    flipped.value = !flipped.value
  }

  return {
    cardIndex,
    flipped,
    items,
    current,
    total,
    resetCard,
    nextCard,
    prevCard,
    toggleFlip
  }
}
```

### 1.2 Create `useKeyboardNavigation.js`

**Why:** Identical keyboard handling exists in 3+ views.

```javascript
// src/composables/useKeyboardNavigation.js
import { useEventListener } from '@vueuse/core'

export function useKeyboardNavigation({ onNext, onPrev, onFlip }) {
  useEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') onNext()
    if (event.key === 'ArrowLeft') onPrev()
    if (event.key === ' ') {
      event.preventDefault()
      onFlip()
    }
  })
}
```

---

## Phase 2: Extract Shared Components (Priority: High) ✅ COMPLETED

> **Status:** Completed on 2026-01-07
>
> **Changes Made:**
> - Created `src/components/layout/BackLink.vue`
> - Created `src/components/layout/SectionHeader.vue`
> - Created `src/components/flashcard/FilterButtonGroup.vue`
> - Created `src/components/flashcard/CardNavigation.vue`
> - Created `src/components/base/BaseBadge.vue` (replaces ClassBadge & LengthBadge)
> - Updated `ConsonantsView.vue` to use new components
> - Updated `VowelsView.vue` to use new components
> - Updated `WordsView.vue` to use new components
>
> **Result:** ~60 LOC eliminated through component extraction, cleaner templates
>
> **Testing (Playwriter MCP):** ✅ All tests passed
> - BackLink component renders correctly on all views
> - SectionHeader displays title and Thai subtitle
> - FilterButtonGroup switches categories/sections properly
> - CardNavigation (arrow buttons) works for prev/next
> - BaseBadge displays class badges (Low/Mid/High) with correct colors
> - BaseBadge displays vowel length badges (Short/Long) with correct colors

### 2.1 Create `BackLink.vue`

**Why:** Duplicated in 4 views with identical SVG icon.

```vue
<!-- src/components/layout/BackLink.vue -->
<script setup>
defineProps({
  to: { type: String, default: '/' },
  label: { type: String, default: 'Back to Home' }
})
</script>

<template>
  <RouterLink
    :to="to"
    class="inline-flex items-center gap-2 text-ink-muted hover:text-azure transition-colors mb-6"
  >
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    <span class="font-display text-sm">{{ label }}</span>
  </RouterLink>
</template>
```

### 2.2 Create `SectionHeader.vue`

**Why:** Same header pattern in all content views.

```vue
<!-- src/components/layout/SectionHeader.vue -->
<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<template>
  <div class="thai-border text-center mb-8 pt-6">
    <h2 class="font-display text-3xl font-semibold text-ink mb-2">{{ title }}</h2>
    <p v-if="subtitle" class="font-thai text-ink-muted text-base">{{ subtitle }}</p>
  </div>
</template>
```

### 2.3 Create `FilterButtonGroup.vue`

**Why:** Category/section filters duplicated in 3 views.

```vue
<!-- src/components/flashcard/FilterButtonGroup.vue -->
<script setup>
import BasePillButton from '@/components/base/BasePillButton.vue'

defineProps({
  options: {
    type: Array,
    required: true
    // [{ value: 'essential', label: 'Essential', count: 23 }]
  },
  modelValue: { type: String, required: true }
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex gap-2 justify-center mb-8 flex-wrap">
    <BasePillButton
      v-for="option in options"
      :key="option.value"
      :active="modelValue === option.value"
      @click="$emit('update:modelValue', option.value)"
    >
      {{ option.label }}
      <span v-if="option.count" class="opacity-60">({{ option.count }})</span>
    </BasePillButton>
  </div>
</template>
```

### 2.4 Create `CardNavigation.vue`

**Why:** Arrow button pair duplicated in 3 views.

```vue
<!-- src/components/flashcard/CardNavigation.vue -->
<script setup>
import BaseArrowButton from '@/components/base/BaseArrowButton.vue'

defineEmits(['prev', 'next'])
</script>

<template>
  <div class="flex gap-4 justify-center items-center mt-8">
    <BaseArrowButton direction="left" @click="$emit('prev')" />
    <BaseArrowButton direction="right" @click="$emit('next')" />
  </div>
</template>
```

### 2.5 Create `BaseBadge.vue`

**Why:** ClassBadge and LengthBadge share 90% structure.

```vue
<!-- src/components/base/BaseBadge.vue -->
<script setup>
const props = defineProps({
  label: { type: String, required: true },
  variant: {
    type: String,
    default: 'default',
    validator: (v) => ['low', 'mid', 'high', 'short', 'long', 'default'].includes(v)
  }
})

const variantClasses = {
  low: 'bg-emerald-100 text-emerald-800',
  mid: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800',
  short: 'bg-amber-100 text-amber-800',
  long: 'bg-sky-100 text-sky-800',
  default: 'bg-stone-100 text-stone-800'
}
</script>

<template>
  <span
    class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
    :class="variantClasses[variant]"
  >
    {{ label }}
  </span>
</template>
```

---

## Phase 3: Create Generic FlashCardView (Priority: High) ✅ COMPLETED

> **Status:** Completed on 2026-01-07
>
> **Changes Made:**
> - Created `src/components/flashcard/FlashCardView.vue` - generic wrapper component
> - Simplified `ConsonantsView.vue` from 103 LOC to 38 LOC (63% reduction)
> - Simplified `VowelsView.vue` from 101 LOC to 37 LOC (63% reduction)
> - Simplified `WordsView.vue` from 92 LOC to 29 LOC (68% reduction)
>
> **Result:** ~190 LOC reduction, views now only contain data config and custom back templates
>
> **Testing (Playwriter MCP):** ✅ All tests passed
> - Consonants: title, Thai chars, progress bar, navigation, filter switching
> - Vowels: title, progress bar, navigation
> - Words: title, progress bar, filter switching, navigation

### 3.1 Create Unified `FlashCardView.vue`

**Why:** Replaces ConsonantsView, VowelsView, WordsView with one configurable component.

```vue
<!-- src/views/FlashCardView.vue -->
<script setup>
import { ref, computed } from 'vue'
import { useCardNavigation } from '@/composables/useCardNavigation'
import { useKeyboardNavigation } from '@/composables/useKeyboardNavigation'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'
import FilterButtonGroup from '@/components/flashcard/FilterButtonGroup.vue'
import CardNavigation from '@/components/flashcard/CardNavigation.vue'
import FlashCard from '@/components/flashcard/FlashCard.vue'
import ProgressBar from '@/components/practice/ProgressBar.vue'
import BaseSoundButton from '@/components/base/BaseSoundButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'

const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  data: { type: Object, required: true },
  filterOptions: { type: Array, required: true },
  defaultFilter: { type: String, required: true },
  cardType: {
    type: String,
    required: true,
    validator: (v) => ['consonant', 'vowel', 'word'].includes(v)
  }
})

const activeFilter = ref(props.defaultFilter)

const { cardIndex, flipped, current, total, nextCard, prevCard, toggleFlip, resetCard } =
  useCardNavigation(() => props.data[activeFilter.value] || [])

useKeyboardNavigation({
  onNext: nextCard,
  onPrev: prevCard,
  onFlip: toggleFlip
})

const changeFilter = (filter) => {
  activeFilter.value = filter
  resetCard()
}
</script>

<template>
  <div class="min-h-screen bg-paper py-8 px-4">
    <div class="max-w-2xl mx-auto">
      <BackLink />
      <SectionHeader :title="title" :subtitle="subtitle" />

      <FilterButtonGroup
        :options="filterOptions"
        :model-value="activeFilter"
        @update:model-value="changeFilter"
      />

      <ProgressBar :current="cardIndex + 1" :total="total" class="mb-6" />

      <FlashCard :flipped="flipped" @flip="toggleFlip" @next="nextCard" @prev="prevCard">
        <template #front>
          <slot name="front" :item="current" />
        </template>
        <template #back>
          <slot name="back" :item="current" />
        </template>
      </FlashCard>

      <CardNavigation @prev="prevCard" @next="nextCard" />
    </div>
  </div>
</template>
```

### 3.2 Update Router to Use FlashCardView

```javascript
// src/router/index.js
{
  path: '/consonants',
  name: 'consonants',
  component: () => import('../views/FlashCardView.vue'),
  props: {
    title: 'Thai Consonants',
    subtitle: 'พยัญชนะไทย',
    cardType: 'consonant',
    // ... other props via route meta or dedicated wrapper
  }
}
```

**Alternative:** Create thin wrapper views that configure FlashCardView:

```vue
<!-- src/views/ConsonantsView.vue (simplified wrapper) -->
<script setup>
import FlashCardView from './FlashCardView.vue'
import consonantsData from '@/data/consonants'

const filterOptions = [
  { value: 'essential', label: 'Essential', count: consonantsData.essential.length },
  { value: 'secondary', label: 'Secondary', count: consonantsData.secondary.length }
]
</script>

<template>
  <FlashCardView
    title="Thai Consonants"
    subtitle="พยัญชนะไทย"
    :data="consonantsData"
    :filter-options="filterOptions"
    default-filter="essential"
    card-type="consonant"
  >
    <template #front="{ item }">
      <span class="font-thai text-8xl">{{ item.thai }}</span>
    </template>
    <template #back="{ item }">
      <!-- Consonant-specific back content -->
    </template>
  </FlashCardView>
</template>
```

---

## Phase 4: Simplify PracticeView (Priority: Medium)

### 4.1 Create `usePracticeState.js`

```javascript
// src/composables/usePracticeState.js
import { ref, computed } from 'vue'

export function usePracticeState(initialCards) {
  const cards = ref([...initialCards])
  const currentIndex = ref(0)
  const answeredCards = ref([])
  const stats = ref({ correct: 0, incorrect: 0 })

  const currentCard = computed(() => cards.value[currentIndex.value])
  const isComplete = computed(() => currentIndex.value >= cards.value.length)
  const progress = computed(() => ({
    current: currentIndex.value,
    total: cards.value.length,
    percentage: Math.round((currentIndex.value / cards.value.length) * 100)
  }))

  const markCorrect = () => {
    stats.value.correct++
    answeredCards.value.push({ ...currentCard.value, correct: true })
    currentIndex.value++
  }

  const markIncorrect = () => {
    stats.value.incorrect++
    answeredCards.value.push({ ...currentCard.value, correct: false })
    currentIndex.value++
  }

  const reset = (newCards) => {
    cards.value = [...newCards]
    currentIndex.value = 0
    answeredCards.value = []
    stats.value = { correct: 0, incorrect: 0 }
  }

  const getMissedCards = () => answeredCards.value.filter(c => !c.correct)

  return {
    cards,
    currentCard,
    currentIndex,
    stats,
    progress,
    isComplete,
    markCorrect,
    markIncorrect,
    reset,
    getMissedCards
  }
}
```

### 4.2 Create `usePracticeDeckBuilder.js`

```javascript
// src/composables/usePracticeDeckBuilder.js
import consonantsData from '@/data/consonants'
import vowelsData from '@/data/vowels'
import wordsData from '@/data/words'

export function usePracticeDeckBuilder() {
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const buildDeck = (options = { consonants: true, vowels: true, words: true, count: 20 }) => {
    const cards = []

    if (options.consonants) {
      consonantsData.essential.forEach(c => cards.push({ ...c, type: 'consonant' }))
    }
    if (options.vowels) {
      vowelsData.essential.forEach(v => cards.push({ ...v, type: 'vowel' }))
    }
    if (options.words) {
      Object.values(wordsData).flat().forEach(w => cards.push({ ...w, type: 'word' }))
    }

    return shuffleArray(cards).slice(0, options.count)
  }

  return { buildDeck, shuffleArray }
}
```

---

## Phase 5: Component Organization (Priority: Medium)

### 5.1 Move Components to Subdirectories

```bash
# Create directories
mkdir -p src/components/{base,flashcard,layout,practice}

# Move base components
mv src/components/BaseArrowButton.vue src/components/base/
mv src/components/BasePillButton.vue src/components/base/
mv src/components/BaseSoundButton.vue src/components/base/

# Move flashcard components
mv src/components/FlashCard.vue src/components/flashcard/

# Move layout components
mv src/components/TheNavbar.vue src/components/layout/

# Move practice components
mv src/components/ProgressBar.vue src/components/practice/
```

### 5.2 Create Index Files for Clean Imports

```javascript
// src/components/base/index.js
export { default as BaseArrowButton } from './BaseArrowButton.vue'
export { default as BaseBadge } from './BaseBadge.vue'
export { default as BasePillButton } from './BasePillButton.vue'
export { default as BaseSoundButton } from './BaseSoundButton.vue'

// Usage in views:
import { BasePillButton, BaseSoundButton } from '@/components/base'
```

---

## Phase 6: Data Normalization (Priority: Low)

### 6.1 Add Type Field to Data Files

```javascript
// src/data/consonants.js
export default {
  essential: [
    { type: 'consonant', thai: 'ก', name: 'Ko Kai', meaning: 'chicken', class: 'mid', sound: '/k/' },
    // ...
  ]
}

// src/data/vowels.js
export default {
  essential: [
    { type: 'vowel', thai: 'ะ', sound: '/a/', length: 'short', example: 'มะ', exampleMeaning: 'horse prefix' },
    // ...
  ]
}
```

### 6.2 Create `config.js` for Metadata

```javascript
// src/data/config.js
export const categories = {
  consonants: {
    label: 'Consonants',
    thaiLabel: 'พยัญชนะ',
    sections: ['essential', 'secondary']
  },
  vowels: {
    label: 'Vowels',
    thaiLabel: 'สระ',
    sections: ['essential', 'secondary']
  },
  words: {
    label: 'Words',
    thaiLabel: 'คำศัพท์',
    sections: ['pronouns', 'questions', 'verbs', 'nouns', 'adjectives', 'particles', 'numbers']
  }
}
```

---

## Implementation Order

| Phase | Task | Impact | Effort | Dependencies |
|-------|------|--------|--------|--------------|
| 1.1 | `useCardNavigation` composable | High | 30 min | None |
| 1.2 | `useKeyboardNavigation` composable | High | 15 min | None |
| 2.1 | `BackLink` component | Medium | 10 min | None |
| 2.2 | `SectionHeader` component | Medium | 10 min | None |
| 2.3 | `FilterButtonGroup` component | Medium | 15 min | BasePillButton |
| 2.4 | `CardNavigation` component | Medium | 10 min | BaseArrowButton |
| 2.5 | `BaseBadge` component | Medium | 15 min | None |
| 3.1 | `FlashCardView` generic view | High | 1-2 hr | Phases 1 & 2 |
| 3.2 | Update/remove old views | High | 30 min | Phase 3.1 |
| 4.1 | `usePracticeState` composable | Medium | 30 min | None |
| 4.2 | `usePracticeDeckBuilder` composable | Medium | 20 min | None |
| 4.3 | Refactor PracticeView | Medium | 45 min | Phases 4.1 & 4.2 |
| 5.1 | Reorganize component folders | Low | 20 min | All above |
| 5.2 | Create index files | Low | 15 min | Phase 5.1 |
| 6.1 | Add type field to data | Low | 15 min | None |
| 6.2 | Create config.js | Low | 15 min | None |

---

## Expected Results

### Before Refactor
- **Total LOC in views**: ~1,025
- **Code duplication**: ~35%
- **Composables**: 2
- **Components**: 8 (flat structure)

### After Refactor
- **Total LOC in views**: ~400 (61% reduction)
- **Code duplication**: <5%
- **Composables**: 6
- **Components**: 14 (organized in 4 folders)

### Benefits
1. **Maintainability**: Changes to card navigation only need to happen in one place
2. **Testability**: Composables can be unit tested independently
3. **Extensibility**: Adding new card types requires minimal code
4. **Readability**: Smaller, focused files are easier to understand
5. **Consistency**: Shared components ensure uniform UI/UX

---

## Questions to Consider

1. **Keep separate view files or use route props?**
   - Option A: Thin wrapper views (ConsonantsView wraps FlashCardView)
   - Option B: Single FlashCardView with all config via route meta/props

2. **TypeScript migration?**
   - Current: JavaScript with JSDoc
   - Future: Consider TypeScript for better type safety

3. **State management?**
   - Current: Local component state + composables
   - Future: Pinia if app grows significantly
