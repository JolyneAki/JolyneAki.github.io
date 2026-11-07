import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import PostList from './PostList.vue'
import Epigraph from './Epigraph.vue'
import PostMeta from './PostMeta.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      // date + tags above the title on any page with a `date:` in its frontmatter
      'doc-before': () => h(PostMeta)
    }),
  enhanceApp({ app }) {
    app.component('PostList', PostList)
    app.component('Epigraph', Epigraph)
  }
} satisfies Theme
