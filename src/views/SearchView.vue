<script setup>
import { computed, ref } from 'vue'
import { searchMovies } from '../services/tmdb'
import MovieCard from '../components/MovieCard.vue'
import EmptyState from '../components/EmptyState.vue'

const query = ref('')
const lastQuery = ref('')
const results = ref([])
const total = ref(0)
const page = ref(1)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref('')
const searched = ref(false)

const hasMore = computed(() => results.value.length < total.value)

async function search() {
  const q = query.value.trim()
  if (!q) return
  loading.value = true
  error.value = ''
  searched.value = true
  lastQuery.value = q
  page.value = 1
  try {
    const data = await searchMovies(q, 1)
    results.value = data.results
    total.value = data.total
  } catch (e) {
    results.value = []
    total.value = 0
    error.value = e.message
  } finally {
    loading.value = false
  }
}

async function loadMore() {
  loadingMore.value = true
  error.value = ''
  try {
    const data = await searchMovies(lastQuery.value, page.value + 1)
    
    const known = new Set(results.value.map((m) => m.id))
    results.value.push(...data.results.filter((m) => !known.has(m.id)))
    page.value += 1
  } catch (e) {
    error.value = e.message
  } finally {
    loadingMore.value = false
  }
}
</script>

<template>
  <section class="searchbody">
    <header class="page-head">
      <h1>Search for a movie</h1>
      <p class="sub">Find a movie, then add it to your library.</p>
    </header>

    <form class="searchbar" role="search" @submit.prevent="search">
      <input v-model="query" type="search" placeholder="Obsession"aria-label="Movie title" autofocus />
      <button class="btn primary" type="submit" :disabled="loading || !query.trim()">Search</button>
    </form>

    <div v-if="loading" class="loader" role="status">
      <span class="spinner" aria-hidden="true"></span> Search in progress…
    </div>

    <div v-else-if="error && !results.length" class="alert error" role="alert">
      <strong>Oops.</strong> {{ error }}
      <button class="btn" @click="search">Try again</button>
    </div>

    <EmptyState v-else-if="searched && !results.length" title="No results found" :text="`No movies found for « ${lastQuery} ». Try a different title or spelling.`" />

    <template v-else>
      <p class="count">{{ total }} result{{ total > 1 ? 's' : '' }} for « {{ lastQuery }} »</p>
      <div class="grid">
        <MovieCard v-for="m in results" :key="m.id" :movie="m" mode="search" />
      </div>

      <div v-if="error" class="alert error" role="alert">{{ error }}</div>
      <div v-if="hasMore" class="more">
        <button class="btn" :disabled="loadingMore" @click="loadMore">
          <span v-if="loadingMore" class="spinner" aria-hidden="true"></span>
          {{ loadingMore ? 'Loading…' : 'Load more' }}
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped>

.searchbar { 
  display: flex; 
  gap: 8px; 
  margin-bottom: 24px; 
}

.searchbar input { 
  flex: 1; 
}

.count { 
  color: var(--text-muted); 
  margin: 0 0 12px; 
  font-size: 0.9rem; 
}

.more { 
  display: flex; 
  justify-content: center; 
  margin: 24px 0; 
}

.loader {
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 10px; 
  padding: 48px; 
  color: var(--text-muted); 
}
</style>
