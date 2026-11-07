<script setup lang="ts">
defineProps<{ by?: string; source?: string }>()
</script>

<template>
  <figure class="epigraph">
    <blockquote><slot /></blockquote>
    <figcaption v-if="by || source">
      <span v-if="by" class="by">{{ by }}</span>
      <span v-if="source" class="source">{{ source }}</span>
    </figcaption>
  </figure>
</template>
