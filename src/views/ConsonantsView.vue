<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useEventListener } from '@vueuse/core'
import { consonantsData } from '@/data/consonants'
import FlashCard from '@/components/FlashCard.vue'
import BasePillButton from '@/components/BasePillButton.vue'
import BaseArrowButton from '@/components/BaseArrowButton.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import ClassBadge from '@/components/ClassBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const subSection = ref('essential')
const cardIndex = ref(0)
const flipped = ref(false)

const items = computed(() =>
  subSection.value === 'essential' ? consonantsData.essential : consonantsData.secondary
)

const current = computed(() => items.value[cardIndex.value])

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

const changeSubSection = (section) => {
  subSection.value = section
  resetCard()
}

// Keyboard navigation
useEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') nextCard()
  if (event.key === 'ArrowLeft') prevCard()
  if (event.key === ' ') {
    event.preventDefault()
    toggleFlip()
  }
})
</script>

<template>
  <div class="px-4 py-8 max-w-xl mx-auto">
    <RouterLink
      to="/"
      class="inline-flex items-center gap-2 text-ink-muted hover:text-azure transition-colors mb-6"
    >
      <svg
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span class="font-display text-sm">Back to Home</span>
    </RouterLink>

    <div class="thai-border text-center mb-8 pt-6">
      <h2 class="font-display text-3xl font-semibold text-ink mb-2">
        Consonants
      </h2>
      <p class="font-thai text-ink-muted text-base">
        พยัญชนะไทย
      </p>
    </div>

    <div class="flex gap-2 justify-center mb-8 flex-wrap">
      <BasePillButton
        :active="subSection === 'essential'"
        @click="changeSubSection('essential')"
      >
        Essential · 23
      </BasePillButton>
      <BasePillButton
        :active="subSection === 'secondary'"
        @click="changeSubSection('secondary')"
      >
        Secondary · 8
      </BasePillButton>
    </div>

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
        <ClassBadge :class-type="current.class" />
      </template>
    </FlashCard>

    <div class="flex gap-4 justify-center items-center mt-8">
      <BaseArrowButton
        direction="left"
        @click="prevCard"
      />
      <BaseArrowButton
        direction="right"
        @click="nextCard"
      />
    </div>
  </div>
</template>
