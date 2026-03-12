---
layout: post
title: "Three picoCTF 2026 Challenges — Crypto, Forensics & Reverse Engineering"
date: 2026-03-12
tags: ctf cryptography forensics reverse-engineering picoCTF diffie-hellman xor disk-forensics timestomping binary-ninja
---

#0xm0t0k0

Disclaimer: I used AI to produce this writeup, bc I was bored of writing. 
Did some slight editing to bring out some character, also **how I derived solution and the though process described is mine**, I am just bored of typing :P

A single session covering three different domains: 1.a broken Diffie-Hellman implementation, 2.a disk forensics challenge built around timestomping, and 3.a binary crackme with a multi-constraint input puzzle. Each one taught something distinct, not just about the specific technique, but about how to read a problem before reaching for tools.

---

## 01 — Diffie-Hellman Key Exposure

**Category:** Cryptography  
**Difficulty:** Easy

### Background

Diffie-Hellman is a key exchange protocol that lets two parties establish a shared secret over an insecure channel. The security rests on the **Discrete Logarithm Problem (DLP)**: given `g`, `p`, and `g^a mod p`, recovering `a` is computationally infeasible for large primes. Both parties agree on public parameters, each picks a secret exponent, and the shared secret follows from exponent commutativity:

```
(g^a)^b ≡ (g^b)^a (mod p)
```

Neither party ever transmits their private exponent. That's the entire protocol.

### The Challenge

We were given a Python script and its output. The encryption was straightforward:

```python
g = 2
p = getPrime(1048)       # 1048-bit prime — genuinely hard to break
a = randint(2, p-2)      # server secret
A = pow(g, a, p)         # server public key

b = randint(2, p-2)      # client secret
B = pow(g, b, p)

shared = pow(A, b, p)
enc = bytes([x ^ (shared % 256) for x in flag])
```

The output file contained `g`, `p`, `A`, the ciphertext — and `b`. The private exponent. Written to disk in plaintext.

### Vulnerability

The 1048-bit prime makes the DLP computationally infeasible. You can't recover `a` from `A`. But that's irrelevant — `b` was handed to us directly. The entire threat model of Diffie-Hellman assumes both private exponents stay secret. Publishing `b` is equivalent to publishing the shared secret itself.

The encryption was also weak independently: a single-byte XOR using `shared % 256` as the key. Even if the DH implementation were correct, that's a trivially broken cipher.

### Solution

With `b` known, compute the shared secret identically to how the server would:

```python
shared = pow(A, b, p)      # A^b mod p — fast via square-and-multiply
key    = shared % 256       # single-byte XOR key
flag   = bytes([x ^ key for x in enc])
print(flag)
```

Python's three-argument `pow()` handles 1000-bit modular exponentiation instantly.

### Takeaway

The math was sound. The implementation was broken. Always audit what your code writes to disk — a correct algorithm with a leaking private key is no algorithm at all.

---

## 02 — Disk Forensics — Timestomping

**Category:** Forensics  
**Difficulty:** Medium

### Background

**Timestomping** is an anti-forensics technique where an attacker modifies file MAC timestamps (Modified, Accessed, Changed) to disguise malicious activity or conceal planted files. Sloppy timestomping introduces detectable anomalies — the most common being timestamps at or near **Unix epoch**: `1970-01-01 00:00:00 UTC`. No legitimate file on a modern system should carry a timestamp from 1970.

The challenge hint confirmed this directly: *"Sloppy timestomping can yield strange (very old) timestamps."*

### Environment

The image was a raw ext4 partition of an embedded Linux (BusyBox) rootfs. Running on macOS M4, which meant:

- `ext4fuse` was not available (Linux-only)
- Autopsy had poor macOS support
- **The Sleuth Kit (sleuthkit)** via Homebrew was the right call — handles raw ext4 images without mounting

### Reconnaissance

```bash
fls -r -p partition4.img              # recursive listing with full paths
strings partition4.img | grep -E "picoCTF\{.*\}"  # plaintext hunt
```

The rootfs contained standard BusyBox directories: `bin`, `etc`, `lib`, `root`, `sbin`, `usr`, `var`. Nothing obvious on surface inspection. The flag was hidden via timestamp manipulation, not path obfuscation.

### MAC Timeline Analysis

The Sleuth Kit's `mactime` workflow generates a full chronological timeline of filesystem activity:

```bash
# Step 1 — generate bodyfile (pipe-delimited MAC data for every inode)
fls -r -m "/" partition4.img > bodyfile.txt

# Step 2 — convert to human-readable timeline
mactime -b bodyfile.txt -d -z UTC > timeline.txt

# Step 3 — hunt for epoch anomalies
grep "1970" timeline.txt

# Alternative — sort bodyfile numerically by mtime (column 8)
sort -t'|' -k8 -n bodyfile.txt | head -20
```

Legitimate files on this image carried timestamps around `1762891277` (approximately 2025). A timestomped file with epoch `0` surfaces immediately when sorted numerically — it has no business being there.

The bodyfile format is worth understanding:

```
0|/path/to/file|inode|permissions|uid|gid|size|atime|mtime|ctime|crtime
```

Column 8 is mtime as Unix epoch. Anything near `0` is the anomaly.

### Extraction and Decode

Once the suspicious inode was identified:

```bash
icat partition4.img <inode>
# output: NzFtMzExbjNfMHU3MTEzcl9oM3JfNDNhMmU3YWYK
```

The output was base64-encoded — identifiable by the character set and trailing padding pattern:

```bash
echo "NzFtMzExbjNfMHU3MTEzcl9oM3JfNDNhMmU3YWYK" | base64 -d
# → flag
```

### Takeaway

Forensics challenges reward methodical enumeration over guessing. The full workflow — `fls` bodyfile → `mactime` timeline → sort by timestamp — is the correct tool for this class of challenge. `strings` and `grep` are fast first passes, but MAC timeline analysis is what surfaces hidden files that don't want to be found.

---

## 03 — Gatekeeper — Reverse Engineering

**Category:** Reverse Engineering  
**Difficulty:** Medium

### Background

The binary was an ELF 64-bit x86-64 executable. No symbols stripped, which meant Ghidra and Binary Ninja could identify `main()` directly.

The RE methodology here:

1. `strings` — surface hardcoded hints, error messages, crypto constants
2. Decompile `main()` in Binary Ninja — get the shape before reading instructions
3. Identify the target: what condition leads to `reveal_flag()`?
4. Analyze constraints — can they all be satisfied simultaneously?

### Decompilation

Binary Ninja's High Level IL decompile of `main()`:

```c
printf("Enter a numeric code (must be > 999): ");
scanf("%31s", &nptr);                    // read as STRING, not integer

int32_t rax_3 = strlen(&nptr);           // store the string LENGTH

if (is_valid_decimal(&nptr) == 0)        // NOT pure decimal?
    if (is_valid_hex(&nptr) != 0)        // but IS valid hex?
        var_40_1 = strtol(&nptr, nullptr, 0x10)  // parse as base-16
        goto label_40164e
else
    var_40_1 = atoi(&nptr)               // parse as decimal

label_40164e:
if   (var_40_1 s<= 0x3e7)  puts("Too small.")
elif (var_40_1 s>  0x270f) puts("Too high.")
elif (rax_3 != 3)          puts("Access Denied.")
else reveal_flag()
```

### The Contradiction

Three conditions must be satisfied simultaneously to reach `reveal_flag()`:

| Condition | Meaning |
|-----------|---------|
| `var_40_1 > 0x3E7` | Numeric value must exceed 999 |
| `var_40_1 <= 0x270F` | Numeric value must not exceed 9999 |
| `rax_3 == 3` | `strlen()` of the raw input must equal 3 |

For **decimal input**: any value greater than 999 requires at least 4 digits. `strlen` of 3 is impossible. The binary appears to be asking for something that can't exist.

The trick is in the second code path. If the input fails `is_valid_decimal()` but passes `is_valid_hex()`, it gets parsed via `strtol` with base 16 instead of `atoi`. A 3-character hex string can have a decimal value well above 999.

The solution:

```
Input: 3e8

is_valid_decimal("3e8") == 0   ✓  contains 'e' — not pure decimal
is_valid_hex("3e8")     != 0   ✓  valid hex string
strtol("3e8", base=16)  = 1000 ✓  1000 > 999 and 1000 <= 9999
strlen("3e8")           = 3    ✓  all conditions pass
```

`reveal_flag()` is called.

### Flag Recovery

The binary output contained `pi_co_ctf` as a delimiter artifact — stripped with a simple replace:

```python
s = output.replace("pi_co_ctf", "")
# → picoCTF{3_digit_hex_GT_999_b639d748}
```

### Takeaway

The instinct to develop in RE: **every condition is a filter**. Draw the decision tree. When you see numeric range checks combined with string length checks, immediately ask whether the *format* of the input affects both independently. `rax_3 != 3` looked like a throwaway guard — it was the entire puzzle, but only after tracing back that `rax_3` came from `strlen()`, not from any numeric parsing.

Read rejection branches as carefully as success branches. They define the shape of what the binary will accept.

---

## Patterns Across All Three

Looking at these together, there's a common thread: **the vulnerability is never where the complexity is**.

The DH challenge had a 1048-bit prime — genuinely hard math — and a trivially broken implementation. The forensics challenge hid a file using a real anti-forensics technique but left a detectable artifact (epoch timestamp) that the right tool surfaces in seconds. The crackme used a real multi-path validator but left a logical contradiction that collapses once you trace variable provenance.

In each case the puzzle was in the gap between what the challenge *looks* like it's testing and what it's actually testing.

---

*0xm0t0k0 — [0xm0t0k0.github.io](https://0xm0t0k0.github.io)*
