<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const toasts = computed(() => store.state.toasts)
const count = computed(() => store.getters.libraryItems.length)
const favCount = computed(() => store.getters.favorites.length)

const theme = ref(document.documentElement.getAttribute('data-theme') || 'light')
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  document.documentElement.setAttribute('data-theme', theme.value)
  try {
    localStorage.setItem('movie-library-theme', theme.value)
  } catch {

  }
}
</script>

<template>
  <header class="topbar">
    <div class="inner">
      <RouterLink to="/" class="brand">Levitate</RouterLink>
      <nav aria-label="Navigation principale">
        <RouterLink to="/" exact-active-class="active">Search</RouterLink>
        <RouterLink to="/library" active-class="active">
          Library <span v-if="count" class="pill">{{ count }}</span>
        </RouterLink>
        <RouterLink to="/favorites" active-class="active">
          Favorites <span v-if="favCount" class="pill">{{ favCount }}</span>
        </RouterLink>
      </nav>
    </div>
  </header>

  <main class="container">
    <RouterView />
  </main>

  <div class="toasts" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">{{ t.message }}</div>
  </div>
</template>

<style>
body {
  position: relative;
  isolation: isolate;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: url('/eyecandy.jpg') center / cover no-repeat;
  opacity: 0.12;
  z-index: -1;
}
</style>