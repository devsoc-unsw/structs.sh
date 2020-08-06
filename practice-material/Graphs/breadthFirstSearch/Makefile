
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testBreadthFirstSearch.c
EXERCISE_FILE = breadthFirstSearch.c
COMMON = Graph.c Queue.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testBreadthFirstSearch

testBreadthFirstSearch: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testBreadthFirstSearch $(SRC_FILES)

clean:
	rm -f testBreadthFirstSearch

