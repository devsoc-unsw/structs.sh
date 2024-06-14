#include <stdio.h>
#include <stdlib.h>
#define ARR_SIZE 10
/**
 * On 32-bit linux system, sizeof(int) == 4 bytes
 * 
 * This program demonstrates how gdb interprets heap memory such a such integer
 * array.
 * 
 * Demo in inside docker container
 * See debugger/readme.md for instructions on how to run debugger
 * interactive shell in docker.
 * ================================
 * root@123583a7996f:/app/src/samples# cd src/samples
 * root@123583a7996f:/app/src/samples# pwd
 * > /app/src/samples
 * root@123583a7996f:/app/src/samples# gcc -ggdb heap_array_test.c -o heap_array_test
 * root@123583a7996f:/app/src/samples# gdb heap_array_test
 * (gdb) start
 * Temporary breakpoint 1 at 0x7dc: file heap_array_test.c, line 29.
 * Starting program: /app/src/samples/heap_array_test
 * warning: Error disabling address space randomization: Operation not permitted
 * [Thread debugging using libthread_db enabled]
 * Using host libthread_db library "/lib/aarch64-linux-gnu/libthread_db.so.1".
 * 
 * Temporary breakpoint 1, main () at heap_array_test.c:29
 * warning: Source file is more recent than executable.
 * 29	    printf("sizeof(int) == %d\n", sizeof(int)); * (gdb) n
 * sizeof(int) == 4
 * 30	    int *list = malloc(sizeof(*list)*ARR_SIZE);
 * (gdb) n
 * 31	    list[0] = 7;
 * (gdb) n
 * 32	    list[1] = 8;
 * (gdb) n
 * 33	    list[2] = 127;  // 2^7 - 1
 * (gdb) n
 * 34	    list[3] = 129;  // 2^7 + 1
 * (gdb) n
 * 35	    list[4] = 255;  // 2^8 - 1
 * (gdb) n
 * 36	    list[5] = 257;  // 2^8 + 1
 * (gdb) n
 * 37	    list[6] = -(1<<31); // -2^31 ie INT_MIN
 * (gdb) n
 * 38	    list[7] = (1<<31)-1; // 2^31 - 1 ie INT_MAX
 * (gdb) n
 * 39	    list[8] = (1<<32); // 2^32 should overflow and reset to 0
 * (gdb) n
 * 40	    list[9] = (1<<32) + 1; // 2^32 + 1 == (2^32 + 1) % 2^32 == 1
 * (gdb) n
 * 42	    for (size_t i = 0; i < ARR_SIZE; ++i) {
 * (gdb) x/10bw list
 * 0xaaaaf1c006b0:	7	8	127	129
 * 0xaaaaf1c006c0:	255	257	-2147483648	2147483647
 * 0xaaaaf1c006d0:	0	1
 * (gdb) continue
 * (gdb) exit
 * ================================
 * 
 * Notes:
 * x command is used to examine heap memory
 * (gdb) x/10dw list
 * ^^^ print out memory pointed to by `list`, show ten 32-bit chunks (w - word) as decimal numbers (d)
 * There are other format options. See https://visualgdb.com/gdbreference/commands/x 
 */

int main() {
    printf("sizeof(int) == %lu\n", sizeof(int));
    int *list = malloc(sizeof(*list)*ARR_SIZE);
    list[0] = 7;
    list[1] = 8;
    list[2] = 127;  // 2^7 - 1
    list[3] = 129;  // 2^7 + 1
    list[4] = 255;  // 2^8 - 1
    list[5] = 257;  // 2^8 + 1
    list[6] = -(1<<31); // -2^31 ie INT_MIN
    list[7] = (1<<31)-1; // 2^31 - 1 ie INT_MAX
    list[8] = (1<<32); // 2^32 should overflow and reset to 0
    list[9] = (1<<32) + 1; // 2^32 + 1 == (2^32 + 1) % 2^32 == 1

    for (size_t i = 0; i < ARR_SIZE; ++i) {
        printf("%p: %i\n", list+i, list[i]);
    }
}