
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testBSTreeGetSmallest.c
EXERCISE_FILE = BSTreeGetSmallest.c
COMMON = BSTree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testBSTreeGetSmallest

testBSTreeGetSmallest: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testBSTreeGetSmallest $(SRC_FILES)

clean:
	rm -f testBSTreeGetSmallest

