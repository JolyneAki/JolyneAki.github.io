import { defineConfig } from 'vitepress'
import { tikzPlugin } from './tikz'

// ---- Edit these -----------------------------------------------------------
const SITE_NAME = "My Site"
const DESCRIPTION = 'Math, code, books, and whatever else.'
const GITHUB_USER = 'your-github-username'
const REPO = `${GITHUB_USER}.github.io`
// ---------------------------------------------------------------------------

export default defineConfig({
  title: SITE_NAME,
  titleTemplate: `:title | ${SITE_NAME}`,
  description: DESCRIPTION,
  lang: 'en-US',

  // A repo named <username>.github.io is served at the root of the domain.
  // If you use some other repo name, set this to '/<repo-name>/'.
  base: '/',

  cleanUrls: true,
  appearance: 'dark',
  lastUpdated: false,

  srcExclude: ['README.md'],

  head: [['link', { rel: 'icon', href: '/favicon.svg' }]],

  markdown: {
    math: true, // $inline$ and $$display$$ LaTeX, typeset with MathJax at build time
    theme: { light: 'github-light', dark: 'github-dark' },
    config: (md) => {
      md.use(tikzPlugin) // ```tikzcd and ```tikz blocks
    }
  },

  themeConfig: {
    siteTitle: SITE_NAME,

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Books', link: '/books' },
      { text: 'Writeups', link: '/writeups/', activeMatch: '^/writeups/' },
      { text: 'Projects', link: '/projects/', activeMatch: '^/projects/' },
      { text: 'Blog', link: '/blog/', activeMatch: '^/blog/' }
    ],

    socialLinks: [{ icon: 'github', link: `https://github.com/${GITHUB_USER}` }],

    outline: { level: [2, 3], label: 'On this page' },

    editLink: {
      pattern: `https://github.com/${GITHUB_USER}/${REPO}/edit/main/:path`,
      text: 'Edit this page on GitHub'
    },

    docFooter: { prev: false, next: false },

    search: { provider: 'local' }
  }
})
