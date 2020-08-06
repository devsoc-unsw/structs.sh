
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = TreeIsPerfectlyBalanced.c
EXERCISE_FILE = testTreeIsPerfectlyBalanced.c
COMMON = tree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testTreeIsPerfectlyBalanced

testTreeIsPerfectlyBalanced: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testTreeIsPerfectlyBalanced $(SRC_FILES)

clean:
	rm -f testTreeIsPerfectlyBalanced

