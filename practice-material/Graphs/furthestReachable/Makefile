
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testFurthestReachable.c
EXERCISE_FILE = furthestReachable.c
COMMON = Graph.c Queue.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testFurthestReachable

testFurthestReachable: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testFurthestReachable $(SRC_FILES)

clean:
	rm -f testFurthestReachable

