<script setup>
  defineProps({
    title: { type: String, required: true },
    text: { type: String, default: '' }
  })
</script>

<template>
  <div class="empty">
    <div class="icon" aria-hidden="true">{{ icon }}</div>
    <h2>{{ title }}</h2>
    <p v-if="text">{{ text }}</p>
    <slot />
  </div>
</template>

<style scoped>
.empty { 
  text-align: center; 
  padding: 56px 16px; 
  color: var(--text-muted); 
}

.icon { 
  font-size: 3rem; 
  margin-bottom: 8px; 
}
h2 { 
  color: var(--text); 
  margin: 0 0 6px; 
  font-size: 1.2rem; 
}

p { 
  margin: 0 0 16px; 
}
</style>
