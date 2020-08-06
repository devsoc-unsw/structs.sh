
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testDepthFirstSearch.c
EXERCISE_FILE = depthFirstSearch.c
COMMON = Graph.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testDepthFirstSearch

testDepthFirstSearch: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testDepthFirstSearch $(SRC_FILES)

clean:
	rm -f testDepthFirstSearch

