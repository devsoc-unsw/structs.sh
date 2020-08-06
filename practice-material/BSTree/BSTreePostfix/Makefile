
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testBSTreePostfix.c
EXERCISE_FILE = BSTreePostfix.c
COMMON = BSTree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testBSTreePostfix

testBSTreePostfix: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testBSTreePostfix $(SRC_FILES)

clean:
	rm -f testBSTreePostfix

