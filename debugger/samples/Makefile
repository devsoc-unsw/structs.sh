# Makefile to compile sample C programs to test debugger.
# Compiled with `-ggdb` flag to include debug symbols to enable debugging
# with `gdb` debugger.

CC = gcc
CFLAGS = -ggdb

.PHONY: all
all: program buggy linkedlist/main1 linkedlist/main2 linkedlist/main3

# ===
program: program.o
	$(CC) $(CFLAGS) -o $@ $^

program.o: program.c

# ===
buggy: buggy.o
	$(CC) $(CFLAGS) -o $@ $^

buggy.o: buggy.c

# ===
linkedlist/main1: linkedlist/main1.o linkedlist/linkedlist.o
	$(CC) $(CFLAGS) -o $@ $^

linkedlist/main1.o: linkedlist/main1.c linkedlist/linkedlist.h

# ===
linkedlist/main2: linkedlist/main2.o linkedlist/linkedlist.o
	$(CC) $(CFLAGS) -o $@ $^

linkedlist/main2.o: linkedlist/main2.c linkedlist/linkedlist.h

# ===
linkedlist/main3: linkedlist/main3.o linkedlist/linkedlist.o
	$(CC) $(CFLAGS) -o $@ $^

linkedlist/main3.o: linkedlist/main3.c linkedlist/linkedlist.h

# ===
linkedlist/linkedlist.o: linkedlist/linkedlist.c linkedlist/linkedlist.h

# ===
.PHONY: clean
clean:
	rm -f *.o linkedlist/*.o program buggy linkedlist/main1 linkedlist/main2 linkedlist/main3