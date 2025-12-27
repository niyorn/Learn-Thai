<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { consonantsData } from '@/data/consonants'
import { vowelsData } from '@/data/vowels'
import { wordsData } from '@/data/words'
import FlashCard from '@/components/FlashCard.vue'
import BaseSoundButton from '@/components/BaseSoundButton.vue'
import ClassBadge from '@/components/ClassBadge.vue'
import LengthBadge from '@/components/LengthBadge.vue'
import ProgressBar from '@/components/ProgressBar.vue'

const practiceFilter = ref('all')
const practiceCards = ref([])
const practiceIndex = ref(0)
const practiceFlipped = ref(false)
const practiceStats = ref({ correct: 0, incorrect: 0, seen: [] })

const practiceOptions = [
  { key: 'all', label: 'Everything', desc: 'Consonants, vowels & words' },
  { key: 'consonants', label: 'Consonants', desc: '31 Thai consonants' },
  { key: 'vowels', label: 'Vowels', desc: '20 Thai vowels' },
  { key: 'words', label: 'Words', desc: '100 common words' },
]

const isStarted = computed(() => practiceCards.value.length > 0)
const isFinished = computed(() => practiceIndex.value >= practiceCards.value.length)
const currentCard = computed(() => practiceCards.value[practiceIndex.value])

const totalAnswered = computed(() => practiceStats.value.correct + practiceStats.value.incorrect)
const percentage = computed(() =>
  totalAnswered.value > 0 ? Math.round((practiceStats.value.correct / totalAnswered.value) * 100) : 0
)
const missedCards = computed(() => practiceStats.value.seen.filter((s) => !s.correct))

const shuffleArray = (array) => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

const buildPracticeDeck = (filter) => {
  const cards = []

  if (filter === 'all' || filter === 'consonants') {
    consonantsData.essential.forEach((c) => cards.push({ ...c, type: 'consonant' }))
    consonantsData.secondary.forEach((c) => cards.push({ ...c, type: 'consonant' }))
  }

  if (filter === 'all' || filter === 'vowels') {
    vowelsData.essential.forEach((v) => cards.push({ ...v, type: 'vowel' }))
    vowelsData.secondary.forEach((v) => cards.push({ ...v, type: 'vowel' }))
  }

  if (filter === 'all' || filter === 'words') {
    Object.values(wordsData).flat().forEach((w) => cards.push({ ...w, type: 'word' }))
  }

  return shuffleArray(cards)
}

const startPractice = (filter) => {
  practiceFilter.value = filter
  practiceCards.value = buildPracticeDeck(filter)
  practiceIndex.value = 0
  practiceFlipped.value = false
  practiceStats.value = { correct: 0, incorrect: 0, seen: [] }
}

const handleAnswer = (correct) => {
  practiceStats.value = {
    correct: practiceStats.value.correct + (correct ? 1 : 0),
    incorrect: practiceStats.value.incorrect + (correct ? 0 : 1),
    seen: [...practiceStats.value.seen, { card: currentCard.value, correct }],
  }
  practiceFlipped.value = false
  setTimeout(() => {
    practiceIndex.value++
  }, 200)
}

const resetPractice = () => {
  practiceCards.value = []
}

const getSoundText = (card) => {
  if (card.type === 'vowel') return card.example
  return card.thai
}
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

    <!-- Category Selection -->
    <template v-if="!isStarted">
      <div class="thai-border text-center mb-8 pt-6">
        <h2 class="font-display text-3xl font-semibold text-ink mb-2">
          Practice
        </h2>
        <p class="text-ink-muted text-base">
          Test your knowledge with random flashcards
        </p>
      </div>

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
            percentage >= 70 ? 'bg-azure-light' : 'bg-coral-light',
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
            percentage >= 70 ? 'text-azure' : 'text-coral',
          ]"
        >
          {{ percentage }}%
        </div>

        <div class="flex justify-center gap-8 mb-7">
          <div>
            <div class="font-display text-3xl font-semibold text-azure">
              {{ practiceStats.correct }}
            </div>
            <div class="text-xs text-ink-muted uppercase tracking-widest">
              Correct
            </div>
          </div>
          <div>
            <div class="font-display text-3xl font-semibold text-coral">
              {{ practiceStats.incorrect }}
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
            class="px-6 py-3 border border-gold-light rounded bg-transparent text-ink-light font-medium text-sm cursor-pointer hover:border-azure hover:text-azure transition-colors"
            @click="resetPractice"
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
          <span class="text-azure font-semibold text-sm">✓ {{ practiceStats.correct }}</span>
          <span class="text-coral font-semibold text-sm">✗ {{ practiceStats.incorrect }}</span>
        </div>
      </div>

      <ProgressBar
        :current="practiceIndex"
        :total="practiceCards.length"
      />

      <FlashCard
        :flipped="practiceFlipped"
        mode="answer"
        @click="practiceFlipped = !practiceFlipped"
        @answer-correct="handleAnswer(true)"
        @answer-incorrect="handleAnswer(false)"
      >
        <template #front>
          <span
            :class="[
              'font-thai font-semibold text-ink leading-none',
              currentCard.type === 'word' ? 'text-[72px] max-sm:text-[56px]' : 'text-[100px] max-sm:text-[80px]',
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
            <ClassBadge :class-type="currentCard.class" />
          </template>

          <!-- Vowel -->
          <template v-else-if="currentCard.type === 'vowel'">
            <div class="font-display text-4xl font-semibold mb-3.5">
              /{{ currentCard.sound }}/
            </div>
            <LengthBadge :length="currentCard.length" />
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
      <div
        v-if="practiceFlipped"
        class="mt-8"
      >
        <p class="font-display text-center text-ink-muted text-xs mb-4">
          Swipe left if you didn't know, swipe right if you got it
        </p>
        <div class="flex gap-3 justify-center flex-wrap">
          <button
            class="px-6 py-3.5 border border-coral rounded bg-coral-light text-coral font-semibold text-sm cursor-pointer flex items-center gap-1.5 hover:bg-coral hover:text-paper transition-colors"
            @click="handleAnswer(false)"
          >
            ← Didn't Know
          </button>
          <button
            class="px-6 py-3.5 border-none rounded bg-azure text-paper font-semibold text-sm cursor-pointer flex items-center gap-1.5 hover:bg-azure-bright transition-colors"
            @click="handleAnswer(true)"
          >
            Got It →
          </button>
        </div>
      </div>

      <p
        v-else
        class="font-display text-center mt-8 text-ink-muted text-sm"
      >
        Flip the card to reveal the answer
      </p>
    </template>
  </div>
</template>
