import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/consonants',
      name: 'consonants',
      component: () => import('@/views/ConsonantsView.vue'),
    },
    {
      path: '/vowels',
      name: 'vowels',
      component: () => import('@/views/VowelsView.vue'),
    },
    {
      path: '/words',
      name: 'words',
      component: () => import('@/views/WordsView.vue'),
    },
    {
      path: '/practice',
      name: 'practice',
      component: () => import('@/views/PracticeView.vue'),
    },
  ],
})

export default router
