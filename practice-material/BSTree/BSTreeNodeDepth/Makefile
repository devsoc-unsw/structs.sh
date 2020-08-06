
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testBSTreeNodeDepth.c
EXERCISE_FILE = BSTreeNodeDepth.c
COMMON = BSTree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testBSTreeNodeDepth

testBSTreeNodeDepth: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testBSTreeNodeDepth $(SRC_FILES)

clean:
	rm -f testBSTreeNodeDepth

