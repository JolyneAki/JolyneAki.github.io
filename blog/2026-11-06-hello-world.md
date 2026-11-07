---
title: Hello, world (and a cheat sheet)
date: 2026-11-06
description: How to write math, code and commutative diagrams on this site.
---

# Hello, world

First post. It doubles as a cheat sheet for everything the site can render, so future me can copy-paste from it.

## Math

Inline math goes between single dollar signs, like $\wp'(z)^2 = 4\wp(z)^3 - g_2\wp(z) - g_3$, and display math between double ones:

$$
G_k(\Lambda) = \sum_{\lambda \in \Lambda \setminus \{0\}} \lambda^{-k}, \qquad g_2 = 60\,G_4,\quad g_3 = 140\,G_6.
$$

Aligned environments work too:

$$
\begin{aligned}
\zeta(s) &= \sum_{n \ge 1} n^{-s} \\
         &= \prod_{p \text{ prime}} \frac{1}{1 - p^{-s}}.
\end{aligned}
$$

::: details Source
```md
Inline: $\wp'(z)^2 = 4\wp(z)^3 - g_2\wp(z) - g_3$

$$
G_k(\Lambda) = \sum_{\lambda \in \Lambda \setminus \{0\}} \lambda^{-k}
$$
```
:::

## Commutative diagrams

A block tagged `tikzcd` holds the inside of a tikz-cd diagram. It gets typeset by real LaTeX when the site builds, and follows the light/dark toggle.

```tikzcd
P \arrow[r, "p_2"] \arrow[d, "p_1"'] \arrow[dr, phantom, "\lrcorner", very near start] & Y \arrow[d, "g"] \\
X \arrow[r, "f"'] & Z
```

Short exact sequences, bent arrows, anything tikz-cd can do:

```tikzcd
0 \arrow[r] & A \arrow[r, "f", hook] & B \arrow[r, "g", two heads] \arrow[l, bend left=40, dashed, "s"] & C \arrow[r] & 0
```

::: details Source
````md
```tikzcd
P \arrow[r, "p_2"] \arrow[d, "p_1"'] & Y \arrow[d, "g"] \\
X \arrow[r, "f"'] & Z
```
````
:::

## Plain TikZ

A block tagged `tikz` takes a whole `tikzpicture`:

```tikz
\begin{tikzpicture}[scale=1.1]
  \draw[->] (-0.3,0) -- (4.3,0) node[right] {$\mathrm{Re}$};
  \draw[->] (0,-0.3) -- (0,3.3) node[above] {$\mathrm{Im}$};
  \foreach \i in {0,...,3} \foreach \j in {0,...,2}
    \fill ({\i + 0.5*\j}, {\j}) circle (1.4pt);
  \draw[very thick, ->] (0,0) -- (1,0) node[below] {$\omega_1$};
  \draw[very thick, ->] (0,0) -- (0.5,1) node[left] {$\omega_2$};
  \draw[dashed] (1,0) -- (1.5,1) -- (0.5,1);
\end{tikzpicture}
```

If a diagram has a mistake, the build doesn't break; the page shows a red box with the LaTeX error instead.

## Code

Fenced code gets syntax highlighting, a language label and a copy button:

```python
from math import isqrt

def is_square(n: int) -> bool:
    r = isqrt(n)
    return r * r == n
```

You can highlight lines with `{2,4}` after the language name:

```rust{2}
fn main() {
    let msg = "hello";
    println!("{msg}, world");
}
```

## Callouts

::: tip
Useful aside.
:::

::: warning
Something to be careful about.
:::
