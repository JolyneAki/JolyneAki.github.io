# Personal site

Built with VitePress, published on GitHub Pages. Every push to `main` rebuilds and republishes it automatically (takes about two minutes; watch progress under the **Actions** tab).

## Writing a post

Easiest way, no tools needed: on GitHub, open the `blog`, `writeups` or `projects` folder, click **Add file → Create new file**, name it like `2026-11-06-my-post.md`, and start it with:

```md
---
title: My post
date: 2026-11-06
description: Optional one-liner shown in the lists.
tags: [optional, tags]
---

# My post

Text, $inline math$, and

$$
\text{display math}
$$
```

Click **Commit changes** and it goes live in a couple of minutes. Every page on the site also has an "Edit this page on GitHub" link at the bottom.

`blog/2026-11-06-hello-world.md` is a cheat sheet for math, code blocks, and diagrams. Add `draft: true` to the frontmatter to hide a post from the lists.

## Diagrams

A fenced block tagged `tikzcd` holds the inside of a tikz-cd diagram; one tagged `tikz` holds a full `tikzpicture`. Options go in brackets: ` ```tikzcd[column sep=large] `. Packages and macros shared by all diagrams live in `.vitepress/tikz-preamble.tex`.

## Other places to edit

- Site name, GitHub username: top of `.vitepress/config.mts`
- Nav tabs: `nav` in the same file
- Home page: `index.md`, books: `books.md`
- Colors and styling: `.vitepress/theme/custom.css`

## Running it on your own computer (optional)

Needs Node.js, plus a LaTeX install with `pdftocairo` if you want diagrams to render.

```sh
npm install
npm run dev
```
