<script setup>
defineProps({
  modelValue: { type: Number, default: 0 },
  readonly: { type: Boolean, default: false }
})
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="stars" role="group" aria-label="Note personnelle">
    <button v-for="n in 5" :key="n" type="button" class="star" :class="{ on: n <= modelValue }" :disabled="readonly" :aria-label="`${n} star${n > 1 ? 's' : ''}`" @click="$emit('update:modelValue', n)">
      ★
    </button>
  </div>
</template>

<style scoped>
.stars { 
  display: inline-flex; 
  gap: 2px; 
}

.star {
  background: none; 
  border: 0; 
  padding: 0 1px; 
  font-size: 1.3rem; 
  line-height: 1;
  color: var(--border-strong); 
  cursor: pointer; 
  transition: transform 0.1s, color 0.1s;
}

.star.on { 
  color: var(--star); 
}

.star:not(:disabled):hover { 
  transform: scale(1.2); 
}

.star:disabled { 
  cursor: default; 
}
</style>
