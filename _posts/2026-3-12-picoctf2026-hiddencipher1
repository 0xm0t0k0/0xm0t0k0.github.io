---
layout: post
title: "HiddenCipher1 aka Reversing a Hardcoded XOR Key"
date: 2026-03-12
tags: ctf reverse-engineering cryptography picoCTF xor
---

# HiddenCipher

**Category:** Reverse Engineering + Cryptography  
**Flag:** `picoCTF{xor_unpack_4nalys1s_2a9da15c}`

---

## The Binary

We're handed an ELF 64-bit executable with no source. First instinct? we use static analysis in Ghidra before even trying to run it (good thing too, since it's x86-64 and I'm on an M4 :p).

---

## Reversing main()

The decompile of `main()` was clean. Stripped down to what matters:

```c
__stream = fopen("flag.txt", "rb");
fseek(__stream, 0, 2);
__n = ftell(__stream);       // get file size
rewind(__stream);
__ptr = malloc(__n + 1);
fread(__ptr, 1, __n, __stream);

lVar2 = get_secret();        // ← key lives here

for (local_2c = 0; local_2c < __n; local_2c++) {
    printf("%02x",
        key[local_2c % 6] ^ flag[local_2c]
    );
}
```

Two things jump out immediately:

- `local_2c % 6` — the key is **exactly 6 bytes**, repeating cyclically over the plaintext
- Output is hex-encoded — the ciphertext we receive from the netcat server is raw XOR, printed as hex

This is a repeating-key XOR cipher, just like a challenge i solved in cryptohack. The structure is identical to a Vigenère cipher operating on bytes ;P

---

## Cracking get_secret()

The key comes from `get_secret()`. Its decompile:

```c
s.0._0_1_ = 0x53;
s.0._1_1_ = 0x33;
s.0._2_1_ = 0x43;
s.0._3_1_ = 0x72;
s.0._4_1_ = 0x33;
s.0._5_1_ = 0x74;
s.0._6_1_ = 0;
return &s.0;
```

Six hardcoded byte literals, null-terminated. Converting from hex to ASCII:

| Byte | ASCII |
|------|-------|
| 0x53 | S     |
| 0x33 | 3     |
| 0x43 | C     |
| 0x72 | r     |
| 0x33 | 3     |
| 0x74 | t     |

**Key = `S3Cr3t`**

The "hidden" cipher had its key sitting in the binary in plaintext the entire time. No bruteforce needed — pure static analysis.

---

## Decryption

XOR is self-inverse: if `c = p ^ k`, then `p = c ^ k`. We apply the same operation in reverse:

```python
ciphertext_bytes = bytes.fromhex(
    "235a201d702015483b1d412b265d3313"
    "501f0c072d135f0d2002302d01156a57"
    "224306172e"
)
key = b"S3Cr3t"

flag = bytes([ciphertext_bytes[i] ^ key[i % 6] for i in range(len(ciphertext_bytes))])
print(flag)
# → picoCTF{xor_unpack_4nalys1s_2a9da15c}
```

---

## What I Learned

The actual cipher is trivially weak, repeating single-key XOR is broken by known-plaintext attack in seconds (the `picoCTF{` prefix alone recovers the full 6-byte key). But the challenge wasn't really about the crypto.

It was about reading a binary cold mostly tracing data flow from `fopen` through `get_secret()` into the encryption loop, and understanding what `% 6` reveals about key length.
Hardcoded secrets in binaries are never secret LOL. `strings`, Ghidra, or five minutes of static analysis will always find them.

---

*0xm0t0k0 — [0xm0t0k0.github.io](https://0xm0t0k0.github.io)*
