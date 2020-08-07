
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testNumReachable.c
EXERCISE_FILE = numReachable.c
COMMON = Graph.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON) Queue.o

all: testNumReachable

testNumReachable: $(SRC_FILES) Queue.o
	$(CC) $(CFLAGS) -o testNumReachable $(SRC_FILES)
Queue.o: Queue.c Queue.h
	$(CC) $(CFLAGS) -o Queue.o Queue.c Queue.h

clean:
	rm -f testNumReachable

