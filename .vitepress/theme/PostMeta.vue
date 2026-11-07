<script setup lang="ts">
import { computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const date = computed(() => {
  const d = frontmatter.value.date
  if (!d) return ''
  // At build time this is a Date, in the browser it's an ISO string. Take the YYYY-MM-DD part either way.
  const iso = (d instanceof Date ? d.toISOString() : String(d)).slice(0, 10)
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})
const tags = computed<string[]>(() => frontmatter.value.tags ?? [])
</script>

<template>
  <div v-if="date" class="vp-doc post-meta-top">
    <time>{{ date }}</time>
    <span v-for="t in tags" :key="t" class="tag">{{ t }}</span>
  </div>
</template>

<style scoped>
.post-meta-top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: var(--vp-c-text-2);
}
.tag {
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  padding: 1px 8px;
  border-radius: 999px;
  background: var(--vp-c-default-soft);
}
</style>
