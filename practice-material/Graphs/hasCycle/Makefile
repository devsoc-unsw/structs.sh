
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testHasCycle.c
EXERCISE_FILE = hasCycle.c
COMMON = Graph.c Stack.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testHasCycle

testHasCycle: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testHasCycle $(SRC_FILES)

clean:
	rm -f testHasCycle

