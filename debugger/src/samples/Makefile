# Makefile to compile sample C programs to test debugger.
# Compiled with `-ggdb` flag to include debug symbols to enable debugging
# with `gdb` debugger.

CC = gcc
CFLAGS = -ggdb

.PHONY: all
all: program buggy linkedlist/main1 linkedlist/main2 linkedlist/main3 linkedlist/main4 fn_declarations printing test_io stdout

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
linkedlist/main4: linkedlist/main4.o linkedlist/linkedlist.o
	$(CC) $(CFLAGS) -o $@ $^

linkedlist/main4.o: linkedlist/main4.c linkedlist/linkedlist.h

# ===
linkedlist/linkedlist.o: linkedlist/linkedlist.c linkedlist/linkedlist.h

# ===
fn_declarations: fn_declarations.o
	$(CC) $(CFLAGS) -o $@ $^

fn_declarations.o: fn_declarations.c

# ===
stack_frames: stack_frames.o
	$(CC) $(CFLAGS) -o $@ $^

stack_frames.o: stack_frames.c

# ===
printing: printing.o
	$(CC) $(CFLAGS) -o $@ $^

printing.o: printing.c

# ===
test_io: test_io.o
	$(CC) $(CFLAGS) -o $@ $^

test_io.o: test_io.c

# ===
stack_test: stack_test.o
	$(CC) $(CFLAGS) -o $@ $^

stack_test.o: stack_test.c

# ===
stdout: stdout.o
	$(CC) $(CFLAGS) -o $@ $^

stdout.o: stdout.c

# ===
.PHONY: clean
clean:
	rm -f *.o linkedlist/*.o program buggy linkedlist/main1 linkedlist/main2 linkedlist/main3 linkedlist/main4 fn_declarations printing test_io stdout
