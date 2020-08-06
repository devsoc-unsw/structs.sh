
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testBSTreeGetKth.c
EXERCISE_FILE = BSTreeGetKth.c
COMMON = BSTree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testBSTreeGetKth

testBSTreeGetKth: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testBSTreeGetKth $(SRC_FILES)

clean:
	rm -f testBSTreeGetKth

