
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testNumWithin.c
EXERCISE_FILE = numWithin.c
COMMON = Graph.c Queue.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testNumWithin

testNumWithin: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testNumWithin $(SRC_FILES)

clean:
	rm -f testNumWithin

