<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from './posts.data'

const props = defineProps<{
  section?: 'blog' | 'writeups' | 'projects'
  limit?: number
  showSection?: boolean
}>()

const list = computed(() => {
  let l = props.section ? posts.filter((p) => p.section === props.section) : posts
  return props.limit ? l.slice(0, props.limit) : l
})

const fmt = (d: string) =>
  d
    ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
</script>

<template>
  <table class="post-list">
    <thead>
      <tr>
        <th>Date</th>
        <th>Name</th>
        <th v-if="showSection">Section</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="p in list" :key="p.url">
        <td class="date">{{ fmt(p.date) }}</td>
        <td>
          <a :href="withBase(p.url)">{{ p.title }}</a>
          <div v-if="p.description" class="desc">{{ p.description }}</div>
        </td>
        <td v-if="showSection" class="section">{{ p.section }}</td>
      </tr>
      <tr v-if="!list.length">
        <td :colspan="showSection ? 3 : 2" class="empty">Nothing here yet.</td>
      </tr>
    </tbody>
  </table>
</template>
