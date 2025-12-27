<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/consonants', label: 'Consonants' },
  { path: '/vowels', label: 'Vowels' },
  { path: '/words', label: 'Words' },
  { path: '/practice', label: 'Practice' },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <nav class="flex justify-center items-center px-4 py-4 bg-cream border-b border-gold-light sticky top-0 z-50">
    <div class="flex gap-1 flex-wrap justify-center">
      <RouterLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'relative px-5 py-3 border-none rounded-none bg-transparent font-display font-medium text-base tracking-wide cursor-pointer transition-all duration-300',
          isActive(item.path) ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink',
        ]"
      >
        {{ item.label }}
        <span
          v-if="isActive(item.path)"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-azure rounded-sm"
        />
      </RouterLink>
    </div>
  </nav>
</template>

<style scoped>
@media (max-width: 640px) {
  nav .flex {
    gap: 4px;
  }

  nav a {
    padding: 10px 12px;
    font-size: 14px;
  }
}
</style>
