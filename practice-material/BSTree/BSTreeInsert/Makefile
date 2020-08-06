
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testBSTreeInsert.c
EXERCISE_FILE = BSTreeInsert.c
COMMON = BSTree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testBSTreeInsert

testBSTreeInsert: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testBSTreeInsert $(SRC_FILES)

clean:
	rm -f testBSTreeInsert

