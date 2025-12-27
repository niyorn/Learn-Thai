<script setup>
import { ref, computed } from 'vue'
import { useEventListener } from '@vueuse/core'
import { vowelsData } from '@/data/vowels'
import FlashCard from '@/components/FlashCard.vue'
import BasePillButton from '@/components/BasePillButton.vue'
import BaseArrowButton from '@/components/BaseArrowButton.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import LengthBadge from '@/components/LengthBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const subSection = ref('essential')
const cardIndex = ref(0)
const flipped = ref(false)

const items = computed(() =>
  subSection.value === 'essential' ? vowelsData.essential : vowelsData.secondary
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
    <div class="thai-border text-center mb-8 pt-6">
      <h2 class="font-display text-3xl font-semibold text-ink mb-2">
        Vowels
      </h2>
      <p class="font-thai text-ink-muted text-base">
        สระไทย
      </p>
    </div>

    <div class="flex gap-2 justify-center mb-8 flex-wrap">
      <BasePillButton
        :active="subSection === 'essential'"
        @click="changeSubSection('essential')"
      >
        Essential · 12
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
        <LengthBadge :length="current.length" />
        <div class="mt-5 px-5 py-3 bg-white/10 rounded flex items-center gap-3 flex-wrap justify-center">
          <span class="font-thai text-2xl">{{ current.example }}</span>
          <span class="opacity-50 text-base">—</span>
          <span class="font-display text-base">{{ current.exampleMeaning }}</span>
        </div>
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
