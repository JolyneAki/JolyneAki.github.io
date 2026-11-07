// Collects every post in blog/, writeups/ and projects/ so the index pages
// and the home page list them automatically. Just add a new .md file with a
// title and date in its frontmatter and it shows up.
import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  date: string // YYYY-MM-DD
  description?: string
  tags?: string[]
  section: 'blog' | 'writeups' | 'projects'
}

declare const data: Post[]
export { data }

export default createContentLoader(['blog/*.md', 'writeups/*.md', 'projects/*.md'], {
  transform(raw): Post[] {
    return raw
      .filter((p) => !p.url.endsWith('/') && !p.frontmatter.draft)
      .map((p) => {
        const d = p.frontmatter.date
        const date = (d instanceof Date ? d.toISOString() : String(d ?? '')).slice(0, 10)
        return {
          title: p.frontmatter.title ?? p.url.split('/').pop()!,
          url: p.url,
          date,
          description: p.frontmatter.description,
          tags: p.frontmatter.tags,
          section: p.url.split('/')[1] as Post['section']
        }
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }
})
