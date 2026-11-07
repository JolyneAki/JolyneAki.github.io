// Build-time TikZ rendering.
//
// In any markdown file, write a fenced block tagged `tikzcd` (just the body of
// a tikz-cd diagram) or `tikz` (a full \begin{tikzpicture} ... \end{tikzpicture}).
// At build time it is compiled with pdflatex, converted to SVG with pdftocairo,
// and inlined into the page. Black ink becomes `currentColor`, so diagrams follow
// the light/dark toggle. Results are cached by content hash, so unchanged
// diagrams are never recompiled.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import type MarkdownIt from 'markdown-it'

const here = path.dirname(new URL(import.meta.url).pathname)
const cacheDir = path.join(here, 'tikz-cache')
const preamblePath = path.join(here, 'tikz-preamble.tex')

// Bump this if the post-processing below changes, to invalidate old cache entries.
const RENDER_VERSION = '5'

function readPreamble(): string {
  try {
    return fs.readFileSync(preamblePath, 'utf8')
  } catch {
    return '\\usepackage{tikz}\n\\usepackage{tikz-cd}\n\\usepackage{amsmath,amssymb}\n'
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)
}

function compile(texBody: string, preamble: string): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'tikz-'))
  try {
    const doc = [
      '\\documentclass[tikz,border=2pt]{standalone}',
      preamble,
      '\\begin{document}',
      texBody,
      '\\end{document}',
      ''
    ].join('\n')
    fs.writeFileSync(path.join(dir, 'd.tex'), doc)
    try {
      execFileSync('pdflatex', ['-interaction=nonstopmode', '-halt-on-error', 'd.tex'], {
        cwd: dir,
        stdio: 'pipe',
        timeout: 60_000
      })
    } catch {
      const log = fs.existsSync(path.join(dir, 'd.log'))
        ? fs.readFileSync(path.join(dir, 'd.log'), 'utf8')
        : 'pdflatex could not run (is TeX installed?)'
      // Keep the useful part of the log: lines starting with "!" and a bit after.
      const lines = log.split('\n')
      const i = lines.findIndex((l) => l.startsWith('!'))
      let excerpt = i >= 0 ? lines.slice(i, i + 8) : lines.slice(-15)
      const stop = excerpt.findIndex((l) => l.startsWith('Here is how much'))
      if (stop > 0) excerpt = excerpt.slice(0, stop)
      if (process.env.TIKZ_DEBUG) console.warn(doc)
      throw new Error(excerpt.join('\n').trimEnd())
    }
    execFileSync('pdftocairo', ['-svg', 'd.pdf', 'd.svg'], { cwd: dir, stdio: 'pipe' })
    return fs.readFileSync(path.join(dir, 'd.svg'), 'utf8')
  } finally {
    fs.rmSync(dir, { recursive: true, force: true })
  }
}

function postProcess(svg: string, id: string): string {
  // Drop the XML prolog.
  svg = svg.replace(/<\?xml[^>]*>\s*/, '')
  // Make ids unique per diagram so several diagrams can live on one page.
  svg = svg
    .replace(/\bid="([^"]+)"/g, `id="${id}-$1"`)
    .replace(/(xlink:href|href)="#([^"]+)"/g, `$1="#${id}-$2"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`)
  // Black ink follows the text color; white fills (e.g. "crossing over") follow the page background.
  svg = svg
    .replace(/rgb\(\s*0%\s*,\s*0%\s*,\s*0%\s*\)/g, 'currentColor')
    .replace(/rgb\(\s*100%\s*,\s*100%\s*,\s*100%\s*\)/g, 'var(--vp-c-bg)')
    // CSS variables only work inside style="", not in presentation attributes.
    .replace(/\b(fill|stroke)="(var\([^)]+\))"/g, 'style="$1:$2"')
  // Size relative to the surrounding text instead of fixed points.
  svg = svg.replace(/<svg([^>]*?)\swidth="([\d.]+)(?:pt)?"\s+height="([\d.]+)(?:pt)?"/, (_m, rest, w, h) => {
    const em = (pt: string) => (parseFloat(pt) / 7.5).toFixed(3) + 'em'
    return `<svg${rest} width="${em(w)}" height="${em(h)}" role="img"`
  })
  return svg
}

export function render(kind: 'tikz' | 'tikzcd', source: string, opts = ''): string {
  const preamble = readPreamble()
  source = source.trim()
  // A blank line is a paragraph break to TeX, which tikz-cd rejects. Drop them.
  if (kind === 'tikzcd') source = source.replace(/\n\s*\n/g, '\n')
  const body = kind === 'tikzcd' ? `\\begin{tikzcd}${opts}\n${source}\n\\end{tikzcd}` : source
  const hash = createHash('sha256').update(RENDER_VERSION + preamble + body).digest('hex').slice(0, 12)
  const cached = path.join(cacheDir, `${hash}.svg`)

  let svg: string
  if (fs.existsSync(cached)) {
    svg = fs.readFileSync(cached, 'utf8')
  } else {
    try {
      svg = postProcess(compile(body, preamble), `tz${hash}`)
    } catch (e: any) {
      console.warn(`\n[tikz] diagram failed to compile:\n${e.message}\n`)
      return (
        `<div class="tikz-error" v-pre><strong>TikZ error</strong>` +
        `<pre>${escapeHtml(e.message)}</pre><details><summary>source</summary>` +
        `<pre>${escapeHtml(source)}</pre></details></div>\n`
      )
    }
    fs.mkdirSync(cacheDir, { recursive: true })
    fs.writeFileSync(cached, svg)
  }
  return `<div class="tikz" v-pre>${svg}</div>\n`
}

export function tikzPlugin(md: MarkdownIt) {
  const fallback = md.renderer.rules.fence!
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    // ```tikzcd, ```tikzcd[column sep=large], ```tikz
    const m = token.info.trim().match(/^(tikz-?cd|tikz)\s*(\[.*\])?\s*$/)
    if (!m) return fallback(tokens, idx, options, env, self)
    if (m[1] === 'tikz') return render('tikz', token.content)
    return render('tikzcd', token.content, m[2] ?? '')
  }
}
