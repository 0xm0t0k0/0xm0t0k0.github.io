---
layout: post
title: "Understanding Assembly"
date: 2025-11-07
tags: 
    - Assembly 
    - Linguistics
    - Stack
---

# 0xm0t0k0

In the words of the great R. Feynman, to understand something, you need to teach it.
That's what I'm gonna be doing in order to solidify and broaden my own knowledge in assembly.
Hope you have as much fun as I do!

To undestand *any* language u have to first know its **fundamentals**
Checklist of things you need to know :
- Understand basic instructions like ```assembly mov, add, sub, cmp, jmp```
- Learn about registers: ```assembly eax, rbp, rsp```
- Understand the stack: ```assembly push, pop``` and stack frames
- Understand how a cpu and computer function at a fundamental level (things like the fetch/execute cycle aka instruction cycle)

Remember : Treat this as learning a new language you need to understand both vocabulary and grammar

So first things first :

**Identify the Structure**

```assembly
endbr64
push %rbp
mov %rsp,%rbp     ;  <- Function prologue
...               ;  <- Function body
pop %rbp          ;  <- Function epilogue
ret
```

**Map the stack**

```assembly
mov    %edi,-0x14(%rbp)  ; Parameter 1 at rbp-0x14
mov    %rsi,-0x20(%rbp)  ; Parameter 2 at rbp-0x20
movl   $0x1e0da,-0x4(%rbp) ; Local var at rbp-0x4
movl   $0x25f,-0xc(%rbp)   ; Local var at rbp-0xc
movl   $0x0,-0x8(%rbp)     ; Local var at rbp-0x8
```

**Make a cheatsheet**
```assembly
-0x4(%rbp)  = main_value (starts: 0x1e0da)
-0x8(%rbp)  = counter (starts: 0)
-0xc(%rbp)  = limit (0x25f = 607)
```

Okay, so we see ourselves understanding that we have a basic loop function in this code (code taken by GDB baby step 2 in picoGym)

```assembly
   0x0000000000401106 <+0>:	endbr64
   0x000000000040110a <+4>:	push   %rbp
   0x000000000040110b <+5>:	mov    %rsp,%rbp                ; function prologue
   0x000000000040110e <+8>:	mov    %edi,-0x14(%rbp)         ; store argc
   0x0000000000401111 <+11>:	mov    %rsi,-0x20(%rbp)     ; store argv
   0x0000000000401115 <+15>:	movl   $0x1e0da,-0x4(%rbp)  ; main value
   0x000000000040111c <+22>:	movl   $0x25f,-0xc(%rbp)
   0x0000000000401123 <+29>:	movl   $0x0,-0x8(%rbp)
   0x000000000040112a <+36>:	jmp    0x401136 <main+48>
   0x000000000040112c <+38>:	mov    -0x8(%rbp),%eax      ; that's the load counter in the loop body
   0x000000000040112f <+41>:	add    %eax,-0x4(%rbp)      ; main_value += counter
   0x0000000000401132 <+44>:	addl   $0x1,-0x8(%rbp)
   0x0000000000401136 <+48>:	mov    -0x8(%rbp),%eax
   0x0000000000401139 <+51>:	cmp    -0xc(%rbp),%eax
   0x000000000040113c <+54>:	jl     0x40112c <main+38>
   0x000000000040113e <+56>:	mov    -0x4(%rbp),%eax
   0x0000000000401141 <+59>:	pop    %rbp
   0x0000000000401142 <+60>:	ret
```
Here is a cheatcode

```assembly

; For loop pattern
movl $0, -0x8(%rbp)        ; i = 0
jmp condition
loop_body:
  ...                      ; loop content
  addl $1, -0x8(%rbp)      ; i++
condition:
  mov -0x8(%rbp), %eax
  cmp -0xc(%rbp), %eax     ; i < limit?
  jl loop_body
``` 

Okay but say we want to see what the value is on the **eax** register in the end of the loop, do we manyally trace it?
Well here is where gdb comes in handy as we can just put a breakpoint in the end of the loop and check the registers witha neat little command.
```bash
chmod +x debugger0_b 
gdb debugger0_b

(gdb) disassemble main # We first need to understand that it's a loop
(gdb) break *main+59 # When we do we put a breakpoint to the end of the function (when loop finishes)
(gdb) run
(gdb) info registers eax
eax            0x4af4b             307019

# We now can quit the gdb
# Run this command and find out the decimal value of eax
python3 -c "print(0x4af4b)"
307019
```
Again, by continuously feeding your brain a language it will naturally get more fluid in it. The key to understanding assembly is repetition. Practice with small functions, trace them manually and gradually you will get to more complex code. 
Also you can use C to assembly translators if you are familiar with C (and if you are not familiar with C please get familiar with it). I like to write programs in C and then trace them through with gdb and understand what I wrote in assembly. 
Most days I get a headache but in the end it's actually kinda cute being able to speak as close to as a human can get to computerish.

**0xm0t0k0 signing out 0.<**


