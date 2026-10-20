<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const stats = computed(() => store.getters.stats)
const items = computed(() => [
  { label: 'Movies', value: stats.value.total },
  { label: 'Watched', value: stats.value.watched },
  { label: 'Plan To Watch', value: stats.value.remaining },
  { label: 'Favorites', value: stats.value.favorites },
  {
    label: 'Average Rating',
    value: stats.value.averageRating === null ? '—' : stats.value.averageRating.toFixed(1) + ' ★'
  }
])
</script>

<template>
  <section class="stats" aria-label="Library stats">
    <div v-for="s in items" :key="s.label" class="stat">
      <span class="value">{{ s.value }}</span>
      <span class="label">{{ s.label }}</span>
    </div>
  </section>
</template>

<style scoped>
.stats { 
  display: grid; 
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); 
  gap: 10px; 
  margin-bottom: 20px; 
}

.stat {
  background: var(--surface); 
  border: 1px solid var(--border); 
  border-radius: var(--radius);
  padding: 12px 14px; 
  display: flex; 
  flex-direction: column; 
  gap: 2px;
}

.value { 
  font-size: 1.5rem; 
  font-weight: 700; 
}

.label { 
  font-size: 0.8rem; 
  color: var(--text-muted); 
}
</style>
