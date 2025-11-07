---
layout: post
title: "Instead of an Introduction"
date: 2025-11-06
tags: 
    - asm 
    - revEng 
    - python 
    - cryptography 
    - xor
---

# 0xm0t0k0

Week 1 is all about learning the **basics of cryptography** using cryptohacks.org. You can find the implementation of solutions 
in my github repo named cryptohack-solutions. 

I also attended the PicoGym and did their intro to assembly and some other introductory exercises.


```asm
<+0>:     endbr64 
<+4>:     push   rbp
<+5>:     mov    rbp,rsp
<+8>:     mov    DWORD PTR [rbp-0x14],edi
<+11>:    mov    QWORD PTR [rbp-0x20],rsi
<+15>:    mov    DWORD PTR [rbp-0x4],0x9fe1a
<+22>:    cmp    DWORD PTR [rbp-0x4],0x2710
<+29>:    jle    0x55555555514e <main+37>
<+31>:    sub    DWORD PTR [rbp-0x4],0x65
<+35>:    jmp    0x555555555152 <main+41>
<+37>:    add    DWORD PTR [rbp-0x4],0x65
<+41>:    mov    eax,DWORD PTR [rbp-0x4]
<+44>:    pop    rbp
<+45>:    ret
```
*Here* is an example of a program i **reverse engineered** and analysed to find the decimal number of the contents of the eax register. It was actually an if/else statement but welp in assembly you kinda have to struggle for it. (I know it's basic stuff but bare with me, future posts will go deeper)

Still for me it was probably the happiest time of my day, everything made sense there.

Here is another challenge called "Favourite byte" and it's from Cryptohack.org.

The string that's being given to us is "73626960647f6b206821204f21254f7d694f7624662065622127234f726927756d"
Now **ask yourself** , how do I solve it?
My thinking was ok, I have a string that I know has been XOR'd (prolly not the smartest idea if u want ur data to be safe)
Aaand I also know that it was encoded with a single byte. Brute-force who? You!

We decode from hex first:

```python
key1 = bytes.fromhex("73626960647f6b206821204f21254f7d694f7624662065622127234f726927756d")

#after we have stored the string from hex to its raw bytes we can work on it

for i in range(256):
    attempt =  bytes(b ^ i for b in key1)
    try:
        print(attempt.decode())
    except UnicodeDecodeError:
        pass
```

What the output looks like : 

sbi`dk h! O!%O}iOv$f eb!'#Ori'um
rchae~j!i !N $N|hNw%g!dc &"Nsh&tl
q`kbf}i"j#"M#'MkMt&d"g`#%!Mpk%wo
pajcg|h#k"#L"&L~jLu'e#fa"$ Lqj$vn
wfmd`{o$l%$K%!KymKr b$af%#'Kvm#qi
vgleazn%m$%J$ JxlJs!c%`g$"&Jwl"ph
udofbym&n'&I'#I{oIp"`&cd'!%Ito!sk
tengcxl'o&'H&"HznHq#a'be& $Hun rj
{jahlwc(`)(G)-GuaG~,n(mj)/+Gza/}e
zk`imvb)a()F(,Ft`F-o)lk(.*F{`.|d
yhcjnua*b+*E+/EwcE|.l*oh+-)Exc-g
xibkot`+c*+D*.DvbD}/m+ni*,(Dyb,~f
nelhsg,d-,C-)CqeCz(j,in-+/C~e+ya
~odmirf-e,-B,(BpdB{)k-ho,*.Bd*x` 

Okay we prolly dont want so much gibberish on our screen: Solution 1: save the output to a file then grep the key bc we know it is gonna have the format crypto{}

Or by working even smarter we can already anticipate that in the first byte its ```python key = input_str[0] ^ ord('c')```
as user bigtuple did and then proceed to xor the rest of the string with the known key. One is brute-forcey, costs more computation, takes longer and one is cleaner and easier. However, in case we don't know the format of the flag, a little bruteforcing can go a long way.

So that's it for this weeks little brain interesting thingies. 
Any other interesting stuff you might wanna suggest or just wanna chat about u can find me on discord under 0xm0t0k0 
Have a great day/night!