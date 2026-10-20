<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import MovieCard from '../components/MovieCard.vue'
import StatsPanel from '../components/StatsPanel.vue'
import EmptyState from '../components/EmptyState.vue'

const store = useStore()
const search = ref('')
const filter = ref('all') // all, favorites, watched, unwatched
const sort = ref('added') // added, title, year

const items = computed(() => store.getters.libraryItems)

const visible = computed(() => {
  const q = search.value.trim().toLowerCase()
  let list = items.value.filter((m) => {
    if (filter.value === 'favorites' && !m.favorite) return false
    if (filter.value === 'watched' && !m.watched) return false
    if (filter.value === 'unwatched' && m.watched) return false
    if (q && !`${m.title} ${m.director}`.toLowerCase().includes(q)) return false
    return true
  })

  list = [...list]
  if (sort.value === 'title') {
    list.sort((a, b) => a.title.localeCompare(b.title, 'fr'))
  } else if (sort.value === 'year') {
    list.sort((a, b) => (parseInt(b.year) || 0) - (parseInt(a.year) || 0))
  } else {
    list.sort((a, b) => b.addedAt - a.addedAt)
  }
  return list
})

function resetFilters() {
  search.value = ''
  filter.value = 'all'
}
</script>

<template>
  <section>
    <header class="page-head">
      <h1>Library</h1>
      <p class="sub">All your movies, with their status, ratings, and favorites.</p>
    </header>

    <EmptyState v-if="!items.length" title="Your library is empty" text="Search for a movie to start building your collection.">
      <RouterLink to="/" class="btn primary">Search for a movie</RouterLink>
    </EmptyState>

    <template v-else>
      <StatsPanel />

      <div class="toolbar">
        <input v-model="search" type="search" placeholder="Search in my library…" aria-label="Search in my library" />
        <select v-model="filter" aria-label="Filter">
          <option value="all">All</option>
          <option value="favorites">Favorites</option>
          <option value="watched">Watched</option>
          <option value="unwatched">Unwatched</option>
        </select>
        <select v-model="sort" aria-label="Sort">
          <option value="added">Date added</option>
          <option value="title">Title (A→Z)</option>
          <option value="year">Year (most recent first)</option>
        </select>
      </div>

      <EmptyState v-if="!visible.length" icon="🔎" title="No movies match your criteria" text="Modify your filters or search query.">
        <button class="btn" @click="resetFilters">Reset Filters</button>
      </EmptyState>

      <div v-else class="grid">
        <MovieCard v-for="m in visible" :key="m.id" :movie="m" mode="library" />
      </div>
    </template>
  </section>
</template>

<style scoped>
.toolbar { 
  display: grid; 
  grid-template-columns: 1fr auto auto; 
  gap: 8px; 
  margin-bottom: 20px; 
}

@media (max-width: 640px) { 
  .toolbar { 
    grid-template-columns: 1fr 1fr; 
  } 
  .toolbar input { 
    grid-column: 1 / -1; 
  }
}
</style>
