#include <stdio.h>
#include <stdlib.h>
#define ARR_SIZE 4

/*
Demo of examining heap array data using gdb x command

1. Starting the container:

    $ docker compose up --build

2. In a separate shell instance, running the debugger in docker interactively:

    $ docker exec -it structssh-debugger-1 bash

3. Inside the interactive ubuntu bash shell in docker, compiling this file with
debug symbols:

    root@93cee7e02576:/app# cd src/samples
    root@93cee7e02576:/app/src/samples# gcc -ggdb heap_array_test_2.c -o heap_array_test_2

4. Run gdb on this executable:

    root@93cee7e02576:/app/src/samples# gdb heap_array_test_2

5. Step through until after list full initialised:

    (gdb) start
    (gdb) next
    (gdb) next
    (gdb) ...

6. Examine the heap array using gdb's x command

    (gdb) x/16ub arr
    0xaaaafad666b0:	16	32	64	128	0	0	0	0
    0xaaaafad666b8:	131	15	204	129	0	0	0	0

We use the following x command format: x/<count> <format> <unit>  <addr>
where
    <count> is the number of <unit> sized chunks of memory to display
    <format> is the format to show each unit eg hexadecimal, octal, binary, decimal
        see this link for all output formats: https://ftp.gnu.org/old-gnu/Manuals/gdb/html_node/gdb_54.html
    <unit> is size of each chunk of memory displayed eg byte (8bits),
        halfword (2bytes), word (4bytes), giant (8bytes)
See x command docs https://ftp.gnu.org/old-gnu/Manuals/gdb/html_node/gdb_55.html

================================================================================

Example 1 walkthrough:

We use the following signed int as an example: -2143281136 (signed decimal form)

In binary using signed 2's complement:

10000000 01000000 00100000 00010000

When decomposed into four bytes and each byte as a decimal:

   128      64        32      16

Now when we examine the arr[0] memory in gdb we get:

    (gdb) x/4b list
    0xaaaaf52646b0:	16	32	64	-128

The bytes are displayed in reverse here as the cpu architecture is little endian

Note the byte 10000000 (binary form) is printed out as -128 instead of 128,
as gdb seems to have defaulted format to signed 8bit decimal.

We can instead specify format to be unsigned decimal:

    (gdb) x/4ub list
    0xaaaaf52646b0:	16	32	64	128

We can reconstruct the original signed int as such:

(2^0 * 16) + (2^8 * 32) + (2^16 * 64) + (2^24 * -128) = 2151686160

Note that for the most significant byte we use -128 (signed two's complement of one-byte)
instead of 128 (unsigned one-byte) because we are trying to reconstruct a signed
four-byte integer! 


================================================================================

Example 2 walkthrough:

We use the following signed int as an example: -2117333117 (signed decimal form)

In binary using signed 2's complement:

10000001 11001100 00001111 10000011

When decomposed into four bytes and each byte as a decimal:

   129     204       15      131

Now when we examine the arr[0] memory in gdb we get:

    (gdb) x/4ub arr
    0xaaaae40016b0:	131	15	204	129

The bytes are displayed in reverse here as the cpu architecture is little endian

Note if you use signed decimal format (x/4db arr) you will get each byte as
signed two's complement of one-byte:

    (gdb) x/4db arr
    0xaaaae40016b0:	-125	15	-52	-127

We can reconstruct the original signed int as such:

(2^0 * 131) + (2^8 * 204) + (2^16 * 15) + (2^24 * -127) = 2151686160

Note that for the most significant byte we use -127 (signed two's complement of one-byte)
instead of 129 (unsigned one-byte) because we are trying to reconstruct a signed
four-byte integer!

================================================================================

*/

int main() {
    printf("sizeof(int) == %lu\n", sizeof(int));

    int *arr = malloc(sizeof(*arr)*ARR_SIZE);
    arr[0] = -2143281136;
    arr[2] = -2117333117;

    // In GDB, break here and do x command to examine the int array.

    for (size_t i = 0; i < ARR_SIZE; ++i) {
        printf("%p: %i\n", arr+i, arr[i]);
    }
}