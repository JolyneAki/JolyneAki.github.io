---
title: Close primes - Fermat factorization
date: 2026-11-06
description: An RSA modulus whose primes are too close together falls to a 400-year-old trick.
tags: [crypto, rsa]
---

# Close primes

## Challenge

We get an RSA public key $(N, e)$ with a 2048-bit $N$, a ciphertext $c$, and the generator script:

```python
from Crypto.Util.number import getPrime, nextprime, bytes_to_long

p = getPrime(1024)
q = nextprime(p + 2**400)   # "random enough"
N = p * q
e = 65537
c = pow(bytes_to_long(FLAG), e, N)
```

## Idea

The gap $q - p$ is roughly $2^{400}$, tiny compared to $p \approx 2^{1024}$. Write

$$
a = \frac{p + q}{2}, \qquad b = \frac{q - p}{2},
$$

so that $N = pq = a^2 - b^2$. Since $b$ is small relative to $a$,

$$
a = \sqrt{N + b^2} = \sqrt{N}\,\sqrt{1 + b^2/N} \approx \sqrt{N} + \frac{b^2}{2\sqrt N}.
$$

Here $b^2 / (2\sqrt N) \approx 2^{798} / 2^{1025} < 1$, so $a = \lceil \sqrt N \rceil$ already, or very nearly. Fermat's method just walks $a$ upward from $\lceil\sqrt N\rceil$ until $a^2 - N$ is a perfect square.

## Solve

```python
from math import isqrt
from Crypto.Util.number import long_to_bytes

def fermat(N: int, max_steps: int = 10**6) -> tuple[int, int]:
    a = isqrt(N)
    if a * a < N:
        a += 1
    for _ in range(max_steps):
        b2 = a * a - N
        b = isqrt(b2)
        if b * b == b2:
            return a - b, a + b
        a += 1
    raise ValueError("primes not close enough")

p, q = fermat(N)
d = pow(e, -1, (p - 1) * (q - 1))
print(long_to_bytes(pow(c, d, N)))
```

It finds the factors on the first iteration.

## Takeaway

The number of steps is about $b^2 / (2\sqrt N)$. If $|p - q| < N^{1/4}$ that's less than one, so the very first guess works. For Fermat to be hopeless, $|p - q|$ has to be *much* bigger than $N^{1/4}$, which honestly generated primes always are.
