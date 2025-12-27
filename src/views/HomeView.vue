<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="px-4 py-10 pb-15 max-w-4xl mx-auto">
    <!-- Hero -->
    <div class="animate-fade-up text-center mb-12 pt-6">
      <div class="mb-6 text-azure tracking-[0.2em] text-xs font-semibold uppercase">
        — Begin Your Journey —
      </div>
      <h1 class="font-display text-[clamp(36px,10vw,72px)] font-semibold text-ink leading-tight mb-4">
        Learn <span class="font-thai text-azure font-semibold">ภาษาไทย</span>
      </h1>
      <p class="font-display text-ink-muted text-xl max-w-md mx-auto leading-relaxed">
        Master the art of reading Thai with elegant flashcards and authentic pronunciation
      </p>
      <!-- Decorative line -->
      <div class="flex items-center justify-center gap-4 mt-10">
        <div class="w-15 h-px bg-gold-light" />
        <div class="w-2 h-2 border border-azure rotate-45" />
        <div class="w-15 h-px bg-gold-light" />
      </div>
    </div>

    <!-- Cards Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
      <!-- Consonants - large card -->
      <RouterLink
        to="/consonants"
        class="paper-texture animate-fade-up animate-delay-1 row-span-1 sm:row-span-2 bg-paper border border-gold-light rounded-lg p-7 cursor-pointer transition-all duration-400 shadow-soft hover:shadow-lifted hover:border-azure-bright flex flex-col justify-between min-h-80"
      >
        <div>
          <div class="text-azure-bright text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">
            Foundation
          </div>
          <h3 class="font-display text-3xl font-semibold text-ink mb-3">
            Consonants
          </h3>
          <p class="text-ink-muted text-sm leading-relaxed">
            Begin with the 44 consonants that form the backbone of Thai script
          </p>
        </div>
        <div class="font-thai text-6xl text-azure opacity-90 mt-6">
          ก ข ค
        </div>
      </RouterLink>

      <!-- Vowels -->
      <RouterLink
        to="/vowels"
        class="paper-texture animate-fade-up animate-delay-2 bg-paper border border-gold-light rounded-lg p-7 cursor-pointer transition-all duration-400 shadow-soft hover:shadow-lifted hover:border-azure-bright"
      >
        <div class="text-azure-bright text-[11px] font-semibold tracking-[0.15em] uppercase mb-3">
          Essential
        </div>
        <h3 class="font-display text-2xl font-semibold text-ink mb-2">
          Vowels
        </h3>
        <p class="text-ink-muted text-sm mb-4">
          20 vowel sounds
        </p>
        <div class="font-thai text-4xl text-coral">
          กา กี กู
        </div>
      </RouterLink>

      <!-- Words -->
      <RouterLink
        to="/words"
        class="paper-texture animate-fade-up animate-delay-3 bg-paper border border-gold-light rounded-lg p-7 cursor-pointer transition-all duration-400 shadow-soft hover:shadow-lifted hover:border-azure-bright"
      >
        <div class="text-azure-bright text-[11px] font-semibold tracking-[0.15em] uppercase mb-3">
          Vocabulary
        </div>
        <h3 class="font-display text-2xl font-semibold text-ink mb-2">
          100 Words
        </h3>
        <p class="text-ink-muted text-sm mb-4">
          Most common vocabulary
        </p>
        <div class="font-thai text-3xl text-ink">
          สวัสดี
        </div>
      </RouterLink>
    </div>

    <!-- Practice card - full width -->
    <RouterLink
      to="/practice"
      class="animate-fade-up animate-delay-4 block bg-gradient-to-br from-azure to-[#1E3A8A] rounded-lg px-9 py-8 cursor-pointer transition-all duration-400 shadow-lifted hover:scale-[1.02] relative overflow-hidden"
    >
      <div class="absolute top-0 left-0 right-0 h-0.75 bg-gradient-to-r from-azure-bright via-[#60A5FA] to-azure-bright" />
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
        <div>
          <div class="text-[#93C5FD] text-[11px] font-semibold tracking-[0.15em] uppercase mb-2">
            Test Your Knowledge
          </div>
          <h3 class="font-display text-3xl font-semibold text-paper">
            Practice Mode
          </h3>
        </div>
        <div class="flex items-center gap-3 text-paper opacity-80">
          <span class="text-sm">Begin</span>
          <svg
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </RouterLink>
  </div>
</template>
