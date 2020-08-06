
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testNumReachable.c
EXERCISE_FILE = numReachable.c
COMMON = Graph.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testNumReachable

testNumReachable: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testNumReachable $(SRC_FILES)

clean:
	rm -f testNumReachable

