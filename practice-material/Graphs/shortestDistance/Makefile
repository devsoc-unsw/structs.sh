
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testShortestDistance.c
EXERCISE_FILE = shortestDistance.c
COMMON = Graph.c Queue.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testShortestDistance

testShortestDistance: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testShortestDistance $(SRC_FILES)

clean:
	rm -f testShortestDistance

