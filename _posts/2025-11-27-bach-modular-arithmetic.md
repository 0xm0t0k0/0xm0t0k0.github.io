---
layout: post
title: "Bach; Worlds First Hacker? Taking inspiration from GEB and applying it to malware analysis"
date: 2025-11-27
tags: 
    - modular arithmetic
    - reverse engineering music
    - music theory 
    - algorithms 
    - computer science philosophy
    - strange loop
    - polymorphism 
    - cryptography
---

# 0xm0t0k0

//Side note: I refer to the book "Gödel, Escher, Bach: An Eternal Golden Braid" by Douglas Hofstadter as GEB in the article

Okay, okay. You're probably here because you are asking how can a musician be the "worlds first hacker"?
Well, of course he didn't gain unauthorized access to digital machines, but as we are going to see he also liked tampering with applied mathematics to produce an outcome that could not be understood by the non-curious and mathematically( and musically) inclined.

# Theoretical Foundations & Links

Music and Cryptography are both at their very core the study of **patterns** *hidden in noise* and **structures** *within limited sets.

So what is the underlying engine between both? **Modular Arithmetic** or "Clock Math". Almost all modern encryption (RSA, Diffie-Hellman, Elliptic Curve) relies on finite fields. 

In music, its one of the same: 
- There are 12 distinct notes (C, C#, D, D#, etc.)
- If you start at C (0) and go up 13 semitones, you don't land on a "13th note." You wrap around and land on C# (1).
 (some pun intended, but C++ doesn't exist in the world of music xd)
- If you treat the 12 notes as a group Z(12), transposing a song is just adding a constant k: f(n)=(n+k)(mod12). This is mathematically identical to the **Rotational Cipher** aka the Caesar Cipher.

Another fun fact about music, which you probably already know:
Notes are nothing more than oscillations of air. Signal processing nerds, you get me? 

Some more stuff about me though: I am currently learning to play the violin and of course I looked the underlying mechanics up. Here is the interesting stuff:
- When I tune by ear, I am performing a biological Fast Fourier Transform(FFT)

OK, big deal, whatever. But, here is the catch: On the violin when you play an open A string (440hz), you aren't just hearing 440hz, you are also hearing a series of overtones: 2 * 440hz = 880hz (corresponds to high A on notes),  3 * 440hz = 1320hz (corresponds to high E). You might notice that ,when you play a *really* in tune A on the D string then the open E vibrates as well, that's called "sympathetic resonance" and it's because there is the 1320hz overtone inside it.

What does that have to do with hacking though? Well, first I believe it proves that music was and remains a good coding tradition, where the assembly is notes, the cpu is the instrument+the player, and you have all these applied mathematics rules for why does everything works the way it works. So we have like the major chords right? This is basically a 4:5:6 integer ratio where you have :
- The Root  (4x): 400 Hz.
- The Third (5x): 500 Hz.
- The Fifth (6x): 600 Hz.
The periodicity of the waves is :
- A 400 Hz wave repeats every 2.5 ms.
- A 500 Hz wave repeats every 2.0 ms.
- A 600 Hz wave repeats every 1.66 ms.

If you start all of them at Time = 0, when do they all finish across the finish line, aka zero crossing?
Answer: @ 10ms
And the:
- 400hz cycles 4 times
- 500hz cycles 5 times
- 600hz cycles *you guessed it* 6 times

It is still a complex pattern but because it happens every 10ms so it resets 100 times per second our little human brains are satisfied giving us a "happy" or in musical language "resolved" feeling.

Let's compare this to a minor chord:
- Root : 10x
- Minor Third : 12x
- Fifth : 15x

Their common denominator is much further away than the major. So the ratio defines the *quality* of things. 

We now circle back on Bach and shift our attention to his famous "Crab Canon", which is a palindrome. Many of his piecessound the same played forward or backwards.

*"The canon per tonos (endlessly rising canon) pits a variant of the king's theme against a two-voice canon at the fifth. However, it modulates and finishes one whole tone higher than it started out at. It thus has no final cadence"*

What that means? 
At the end of the melody, it modulates up a step and repeats. It will forever spiral upwards. It is a loop that contains the instructions for its own repetition. Can you think of something else that does that?
Well what about a **Worm** or **Recursion** in general?
A worm is basically recursion on a network graph.

Okay that's half interesting but we now move to the most interesting of his works and how they tie to malware beautifully.

Bach's Goldberg Variations include **the theme** (Aria) And the melody REWRITTEN 30 times, sometimes slow, sometimes fast, sometimes in minor.(Can you think of something else that rewrites itself to bypass detection?) If we werer to input to a music recognition algorithm, it would detect 31 different songs. But a human can *feel* and recognize the underlying melody being the same. Why? Not because of some metaphysical quality but because our little organic brains store the **relationship** between things. In psychology, there is a theme called **"Gestalt"** and it translates to "The whole is other than the parts". These are the reasons why we understand the underlying theme (Aria) or understand how malware behaves, not just because we understand how every piece of it functions. Of course we do not say oh this is 440hz and oh here he uses this and this and that (unless u are a music theorist). We also understand **Teleology** , that is *Purpose*. We know code is written for some purpose, we know malware has a purpose as well and we understand that context. Until we have great neuro-symbolic AI models, that is systems that combine the statistical pattern matching of Neural Networks (the gut feeling) with the hard logic of symbolic reasoning (the rulebook) humans will be unique in this ability.

In GEB, Hofstadter uses Bach’s music to explain how a system (like a computer language or a fugue) can "talk about itself." Even then, and that is why GEB is brilliant at capturing the essence of the underlying problems of Computer Science theory, in the Incompleteness Theorem, Kurt Gödel proved that in any complex logical system (like Math or Computer Code), there are statements that are true but unprovable. How that translates into the security landscape: It is mathematically proven (via the Halting Problem, which is related to Gödel) that you cannot write a program that always decides correctly if another program is malicious.

Another example for understanding a theme:
Lockbit (uses AES encryption) and WannaCry (uses ChaCha20)

Their "theme" though is the same:
>Open a file.

>Read the content.

>Do math on the content.

>Write the content back.

Rename the file.

We understand the underlying theme is Ransomware.

Bach understood the power of the themes we discussed intuitively and used clever ways to trick a mathematical system of logic.
We do the same with malware.
