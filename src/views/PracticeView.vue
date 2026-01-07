<script setup>
import { ref, computed } from 'vue'
import { usePracticeState } from '@/composables/usePracticeState'
import { usePracticeDeckBuilder } from '@/composables/usePracticeDeckBuilder'
import FlashCard from '@/components/FlashCard.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import BaseBadge from '@/components/base/BaseBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'
import BackLink from '@/components/layout/BackLink.vue'
import SectionHeader from '@/components/layout/SectionHeader.vue'

const flashCardRef = ref(null)
const practiceFilter = ref('all')

const {
  cards,
  currentIndex,
  flipped,
  stats,
  isStarted,
  isFinished,
  currentCard,
  percentage,
  missedCards,
  start,
  handleAnswer,
  reset,
  toggleFlip,
  getMissedCards
} = usePracticeState()

const { buildDeck, buildDeckFromCards } = usePracticeDeckBuilder()

const practiceOptions = [
  { key: 'all', label: 'Everything', desc: 'Consonants, vowels & words' },
  { key: 'consonants', label: 'Consonants', desc: '31 Thai consonants' },
  { key: 'vowels', label: 'Vowels', desc: '20 Thai vowels' },
  { key: 'words', label: 'Words', desc: '100 common words' }
]

const startPractice = (filter) => {
  practiceFilter.value = filter
  start(buildDeck(filter))
}

const practiceMissed = () => {
  const missed = getMissedCards()
  start(buildDeckFromCards(missed))
}

const getSoundText = (card) => {
  if (card.type === 'vowel') return card.example
  return card.thai
}

const handleButtonAnswer = (correct) => {
  const direction = correct ? 'right' : 'left'
  flashCardRef.value?.animateOut(direction, () => handleAnswer(correct))
}
</script>

<template>
  <div class="px-4 py-8 max-w-xl mx-auto">
    <BackLink />

    <!-- Category Selection -->
    <template v-if="!isStarted">
      <SectionHeader
        title="Practice"
        subtitle="Test your knowledge with random flashcards"
      />

      <div class="paper-texture bg-paper border border-gold-light rounded-lg p-7 shadow-soft">
        <p class="font-display text-base text-ink-light mb-6 text-center">
          Select a category to begin
        </p>
        <div class="flex flex-col gap-2.5">
          <button
            v-for="opt in practiceOptions"
            :key="opt.key"
            class="flex justify-between items-center px-6 py-5 border border-gold-light rounded bg-cream cursor-pointer transition-all duration-300 hover:border-azure hover:bg-azure-light text-left"
            @click="startPractice(opt.key)"
          >
            <div>
              <div class="font-display text-lg font-semibold text-ink">
                {{ opt.label }}
              </div>
              <div class="text-sm text-ink-muted mt-1">
                {{ opt.desc }}
              </div>
            </div>
            <svg
              class="w-5 h-5 text-azure-bright"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </template>

    <!-- Results -->
    <template v-else-if="isFinished">
      <div class="paper-texture bg-paper border border-gold-light rounded-lg p-8 shadow-lifted text-center">
        <div
          :class="[
            'w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5',
            percentage >= 70 ? 'bg-azure-light' : 'bg-coral-light'
          ]"
        >
          <span class="text-3xl">{{ percentage >= 80 ? '✦' : percentage >= 60 ? '◆' : '○' }}</span>
        </div>

        <h2 class="font-display text-2xl font-semibold text-ink mb-2">
          Complete
        </h2>

        <div
          :class="[
            'font-display text-5xl font-semibold mb-6',
            percentage >= 70 ? 'text-azure' : 'text-coral'
          ]"
        >
          {{ percentage }}%
        </div>

        <div class="flex justify-center gap-8 mb-7">
          <div>
            <div class="font-display text-3xl font-semibold text-azure">
              {{ stats.correct }}
            </div>
            <div class="text-xs text-ink-muted uppercase tracking-widest">
              Correct
            </div>
          </div>
          <div>
            <div class="font-display text-3xl font-semibold text-coral">
              {{ stats.incorrect }}
            </div>
            <div class="text-xs text-ink-muted uppercase tracking-widest">
              Missed
            </div>
          </div>
        </div>

        <div class="flex gap-2.5 justify-center flex-wrap">
          <button
            class="px-6 py-3 border-none rounded bg-azure text-paper font-semibold text-sm cursor-pointer hover:bg-azure-bright transition-colors"
            @click="startPractice(practiceFilter)"
          >
            Practice Again
          </button>
          <button
            v-if="missedCards.length > 0"
            class="px-6 py-3 border border-coral rounded bg-coral-light text-coral font-semibold text-sm cursor-pointer hover:bg-coral hover:text-paper transition-colors"
            @click="practiceMissed"
          >
            Practice Missed ({{ missedCards.length }})
          </button>
          <button
            class="px-6 py-3 border border-gold-light rounded bg-transparent text-ink-light font-medium text-sm cursor-pointer hover:border-azure hover:text-azure transition-colors"
            @click="reset"
          >
            Change Category
          </button>
        </div>
      </div>

      <!-- Missed cards review -->
      <div
        v-if="missedCards.length > 0"
        class="mt-6 bg-paper border border-gold-light rounded-lg p-5 text-left"
      >
        <h3 class="font-display text-base text-ink mb-3">
          Review these:
        </h3>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="(item, i) in missedCards"
            :key="i"
            class="px-3 py-1.5 bg-coral-light rounded text-sm"
          >
            <span class="font-thai font-semibold mr-1.5">{{ item.card.thai }}</span>
            <span class="text-ink-muted">
              {{ item.card.type === 'word' ? item.card.meaning : item.card.sound || item.card.name }}
            </span>
          </span>
        </div>
      </div>
    </template>

    <!-- Practice Cards -->
    <template v-else>
      <div class="flex justify-between items-center mb-5">
        <span class="px-3 py-1.5 bg-cream-dark rounded text-xs font-semibold text-ink-light uppercase tracking-wide">
          {{ currentCard.type }}
        </span>
        <div class="flex gap-4 items-center">
          <span class="text-azure font-semibold text-sm">✓ {{ stats.correct }}</span>
          <span class="text-coral font-semibold text-sm">✗ {{ stats.incorrect }}</span>
        </div>
      </div>

      <ProgressBar
        :current="currentIndex"
        :total="cards.length"
      />

      <FlashCard
        ref="flashCardRef"
        :flipped="flipped"
        mode="answer"
        @click="toggleFlip"
        @answer-correct="handleAnswer(true)"
        @answer-incorrect="handleAnswer(false)"
      >
        <template #front>
          <span
            :class="[
              'font-thai font-semibold text-ink leading-none',
              currentCard.type === 'word' ? 'text-[72px] max-sm:text-[56px]' : 'text-[100px] max-sm:text-[80px]'
            ]"
          >
            {{ currentCard.thai }}
          </span>
          <div class="mt-5">
            <BaseSoundButton
              :text="getSoundText(currentCard)"
              size="lg"
            />
          </div>
          <p class="font-display text-ink-muted text-sm mt-4">
            tap to reveal
          </p>
        </template>

        <template #back>
          <!-- Consonant -->
          <template v-if="currentCard.type === 'consonant'">
            <div class="font-display text-lg mb-1.5 opacity-95">
              {{ currentCard.name }}
            </div>
            <div class="text-sm mb-3.5 opacity-70">
              {{ currentCard.meaning }}
            </div>
            <div class="font-display text-4xl font-semibold mb-4">
              /{{ currentCard.sound }}/
            </div>
            <BaseBadge
              :variant="currentCard.class.toLowerCase()"
              :label="`${currentCard.class} Class`"
              show-dot
            />
          </template>

          <!-- Vowel -->
          <template v-else-if="currentCard.type === 'vowel'">
            <div class="font-display text-4xl font-semibold mb-3.5">
              /{{ currentCard.sound }}/
            </div>
            <BaseBadge
              :variant="currentCard.length.toLowerCase()"
              :label="`${currentCard.length} vowel`"
            />
            <div class="mt-4 px-4 py-2.5 bg-white/10 rounded flex items-center gap-2.5 flex-wrap justify-center">
              <span class="font-thai text-xl">{{ currentCard.example }}</span>
              <span class="opacity-50">—</span>
              <span class="font-display text-base">{{ currentCard.exampleMeaning }}</span>
            </div>
          </template>

          <!-- Word -->
          <template v-else>
            <div class="text-base mb-2.5 opacity-70 tracking-wide">
              {{ currentCard.translit }}
            </div>
            <div class="font-display text-4xl font-semibold">
              {{ currentCard.meaning }}
            </div>
          </template>
        </template>
      </FlashCard>

      <!-- Answer buttons -->
      <div class="mt-8">
        <p class="font-display text-center text-ink-muted text-xs mb-4">
          Swipe or tap to answer
        </p>
        <div class="flex gap-3 justify-center flex-wrap">
          <button
            class="px-6 py-3.5 border border-coral rounded bg-coral-light text-coral font-semibold text-sm cursor-pointer flex items-center gap-1.5 hover:bg-coral hover:text-paper transition-colors"
            @click="handleButtonAnswer(false)"
          >
            ← Didn't Know
          </button>
          <button
            class="px-6 py-3.5 border-none rounded bg-azure text-paper font-semibold text-sm cursor-pointer flex items-center gap-1.5 hover:bg-azure-bright transition-colors"
            @click="handleButtonAnswer(true)"
          >
            Got It →
          </button>
        </div>
      </div>
    </template>
  </div>
</template>
