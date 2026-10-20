<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getMovie } from '../services/tmdb'
import StarRating from '../components/StarRating.vue'

const props = defineProps({ id: { type: String, required: true } })

const store = useStore()
const apiMovie = ref(null)
const loading = ref(true)
const error = ref('')

const saved = computed(() => store.getters.getById(props.id))

const movie = computed(() => (apiMovie.value ? { ...apiMovie.value, ...(saved.value || {}) } : saved.value))

async function load() {
  loading.value = true
  error.value = ''
  apiMovie.value = null
  try {
    apiMovie.value = await getMovie(props.id)
  } catch (e) {
    if (!saved.value) error.value = e.message
  } finally {
    loading.value = false
  }
}
watch(() => props.id, load, { immediate: true })

const note = ref('')
watch(saved, (s) => { note.value = s?.note || '' }, { immediate: true })
function saveNote() {
  if (saved.value) {
    store.dispatch('setNote', { id: props.id, note: note.value.trim() })
    store.dispatch('notify', { message: 'Rating saved' })
  }
}
</script>

<template>
  <section>
    <RouterLink to="/library" class="back">← Back</RouterLink>

    <div v-if="loading && !movie" class="loader" role="status"><span class="spinner"></span> Loading...</div>
    <div v-else-if="error" class="alert error" role="alert">{{ error }} <button class="btn" @click="load">Try again?</button></div>

    <article v-else-if="movie" class="detail">
      <img v-if="movie.poster" :src="movie.poster" :alt="`Affiche de ${movie.title}`" class="poster" />
      <div v-else class="poster fallback" aria-hidden="true">?</div>

      <div class="info">
        <h1>{{ movie.title }} <small v-if="movie.year">({{ movie.year }})</small></h1>
        <p class="meta">
          Directed by <strong>{{ movie.director }}</strong>
          <span v-if="movie.runtime"> · {{ movie.runtime }}</span>
          <span v-if="movie.genre"> · {{ movie.genre }}</span>
        </p>
        <p v-if="movie.voteAverage" class="meta">TMDB rating: {{ movie.voteAverage }}/10</p>
        <p v-if="movie.actors" class="meta">With {{ movie.actors }}</p>
        <p v-if="movie.plot" class="plot">{{ movie.plot }}</p>

        <div v-if="!saved" class="actions">
          <button class="btn primary" @click="store.dispatch('addMovie', movie)">+ Add to my library</button>
        </div>

        <template v-else>
          <div class="actions">
            <button class="btn" :class="{ primary: saved.watched }" @click="store.dispatch('toggleWatched', id)">
              {{ saved.watched ? '✓ Watched' : 'Mark as watched' }}
            </button>
            <button class="btn" :class="{ fav: saved.favorite }" @click="store.dispatch('toggleFavorite', id)">
              {{ saved.favorite ? '♥ Favorite' : '♡ Add to favorites' }}
            </button>
          </div>

          <div class="block">
            <h2>My rating</h2>
            <StarRating :model-value="saved.rating" @update:model-value="store.dispatch('setRating', { id, rating: $event })" />
          </div>

          <div class="block">
            <h2>My review</h2>
            <textarea v-model="note" rows="4" maxlength="500"></textarea>
            <button class="btn primary" @click="saveNote">Save</button>
          </div>
        </template>
      </div>
    </article>
  </section>
</template>

<style scoped>
.back { 
  display: inline-block;
  margin-bottom: 16px; 
  color: var(--text-muted); 
  text-decoration: none; 
}

.back:hover { 
  color: var(--accent); 
}

.detail { 
  display: grid; 
  grid-template-columns: 280px 1fr; 
  gap: 28px; 
  align-items: start; 
}

.poster { 
  width: 100%; 
  border-radius: var(--radius); 
  background: var(--surface-2); 
  aspect-ratio: 2/3; 
  object-fit: cover; 
}

.poster.fallback { 
  display: grid; 
  place-items: center; 
  font-size: 4rem; }

h1 { 
  margin: 0 0 8px; 
  font-size: 1.8rem; 
}

h1 small { 
  font-weight: 400; 
  color: var(--text-muted); 
}

.meta { 
  margin: 0 0 6px; 
  color: var(--text-muted); 
}

.plot { 
  line-height: 1.6; 
  margin: 16px 0; 
}

.actions { 
  display: flex; 
  gap: 8px; 
  flex-wrap: wrap; 
  margin: 16px 0; 
}

.block { 
  margin-top: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  align-items: flex-start; 
}

.block h2 { 
  font-size: 1rem; 
  margin: 0; 
}

textarea { 
  width: 100%; 
}

.loader { 
  display: flex; 
  gap: 10px; 
  align-items: center; 
  justify-content: center; 
  padding: 48px; 
  color: var(--text-muted); 
}

@media (max-width: 720px) {
  .detail {
    grid-template-columns: 1fr;
    } 
  .poster {
    max-width: 240px;
  }
}
</style>
