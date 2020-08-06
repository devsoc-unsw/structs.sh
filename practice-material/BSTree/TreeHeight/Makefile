
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testTreeHeight.c
EXERCISE_FILE = TreeHeight.c
COMMON = tree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testTreeHeight

testTreeHeight: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testTreeHeight $(SRC_FILES)

clean:
	rm -f testTreeHeight

