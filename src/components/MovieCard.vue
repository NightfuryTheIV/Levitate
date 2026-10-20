<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import StarRating from './StarRating.vue'

const props = defineProps({
  movie: { type: Object, required: true },
  mode: { type: String, default: 'search' }
})

const store = useStore()
const confirming = ref(false)
const posterFailed = ref(false)

const inLibrary = computed(() => store.getters.isInLibrary(props.movie.id))
const showPoster = computed(() => props.movie.poster && !posterFailed.value)

function add() {
  store.dispatch('addMovie', props.movie)
}

function remove() {
  store.dispatch('removeMovie', props.movie.id)
  confirming.value = false
}
</script>

<template>
  <article class="card" :class="{ watched: mode === 'library' && movie.watched }">
    <RouterLink :to="`/movie/${movie.id}`" class="poster-link" :aria-label="`Details for ${movie.title}`">
      <img v-if="showPoster" :src="movie.poster" :alt="`Poster for ${movie.title}`" loading="lazy" @error="posterFailed = true" />
      <div v-else class="poster-fallback" aria-hidden="true">?</div>
      <span v-if="mode === 'library' && movie.watched" class="badge">Seen</span>
    </RouterLink>

    <div class="body">
      <h3 class="title">
        <RouterLink :to="`/movie/${movie.id}`">{{ movie.title }}</RouterLink>
      </h3>
      <p class="meta">{{ movie.director }}<span v-if="movie.year"> · {{ movie.year }}</span></p>


      <div v-if="mode === 'search'" class="actions">
        <button v-if="!inLibrary" class="btn primary" @click="add">+ Add</button>
        <RouterLink v-else to="/library" class="btn ghost">✓ In Library</RouterLink>
      </div>

      <template v-else>
        <StarRating :model-value="movie.rating" @update:model-value="store.dispatch('setRating', { id: movie.id, rating: $event })" />
        <p v-if="movie.note" class="note">« {{ movie.note }} »</p>
        <div class="actions">
          <button class="btn" :class="{ primary: movie.watched }" @click="store.dispatch('toggleWatched', movie.id)">
            {{ movie.watched ? '✓ Seen' : 'Mark as seen' }}
          </button>
          <button
            class="btn icon"
            :class="{ fav: movie.favorite }"
            :aria-pressed="movie.favorite"
            :aria-label="movie.favorite ? 'Remove from favorites' : 'Add to favorites'"
            @click="store.dispatch('toggleFavorite', movie.id)"
          >
            {{ movie.favorite ? '♥' : '♡' }}
          </button>
          <button class="btn icon danger" aria-label="Delete" @click="confirming = true">🗑</button>
        </div>
      </template>
    </div>

    <div v-if="confirming" class="confirm" role="alertdialog" aria-label="Confirm deletion">
      <p>Delete <strong>{{ movie.title }}</strong> from your library?</p>
      <div class="actions">
        <button class="btn danger-solid" @click="remove">Delete</button>
        <button class="btn" @click="confirming = false">Cancel</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.card {
  position: relative; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden;
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: var(--radius);
  transition: transform 0.15s, box-shadow 0.15s;
}

.card:hover { 
  transform: translateY(-2px); 
  box-shadow: var(--shadow); 
}

.poster-link { 
  position: relative; 
  display: block; 
  aspect-ratio: 2 / 3; 
  background: var(--surface-2); 
}

.poster-link img { 
  width: 100%; 
  height: 100%; 
  object-fit: cover; 
  display: block; 
}

.poster-fallback { 
  height: 100%; 
  display: grid; 
  place-items: center; 
  font-size: 3rem; 
  opacity: 0.5; 
}

.badge {
  position: absolute; 
  top: 8px; 
  left: 8px; 
  background: var(--accent); 
  color: #fff;
  font-size: 0.7rem; 
  font-weight: 700; 
  padding: 2px 8px; 
  border-radius: 99px;
}

.body { 
  padding: 12px; 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
  flex: 1; }

.title { 
  font-size: 1rem; 
  margin: 0; 
  line-height: 1.25; 
}

.title a { 
  color: inherit; 
  text-decoration: none; 
}

.title a:hover { 
  color: var(--accent); 
}

.meta { 
  margin: 0; 
  color: var(--text-muted); 
  font-size: 0.85rem; 
}

.note {
  margin: 0; 
  font-size: 0.8rem; 
  color: var(--text-muted); 
  font-style: italic;
  display: -webkit-box; 
  -webkit-line-clamp: 2; 
  -webkit-box-orient: vertical; 
  overflow: hidden;
}

.actions { 
  display: flex; 
  gap: 6px; 
  margin-top: auto; 
  padding-top: 6px; 
  flex-wrap: wrap; 
}

.actions .btn:first-child:not(.icon) { 
  flex: 1; 
}

.confirm {
  position: absolute; 
  inset: 0; 
  background: color-mix(in srgb, var(--surface) 94%, transparent);
  display: flex; 
  flex-direction: column; 
  justify-content: center; 
  align-items: center;
  gap: 8px; 
  padding: 16px; 
  text-align: center; 
  backdrop-filter: blur(2px);
}

.confirm p { 
  margin: 0; 
  font-size: 0.9rem; 
}

.watched .poster-link img { 
  opacity: 0.85; 
}
</style>
