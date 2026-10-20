<script setup>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import MovieCard from '../components/MovieCard.vue'
  import EmptyState from '../components/EmptyState.vue'

  const store = useStore()

  const favorites = computed(() => store.getters.favorites)
</script>

<template>
  <section>
    <header class="page-head">
      <h1>My favorites</h1>
      <p class="sub">{{ favorites.length }} movies that hold a special place in your heart.</p>
    </header>

    <EmptyState v-if="!favorites.length" title="No favorites yet" text="Click the heart icon on a movie in your library to add it here.">
      <RouterLink to="/library" class="btn primary">View My Library</RouterLink>
    </EmptyState>

    <div v-else class="grid">
      <MovieCard v-for="m in favorites" :key="m.id" :movie="m" mode="library" />
    </div>
  </section>
</template>
