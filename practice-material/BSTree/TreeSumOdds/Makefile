
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testTreeSumOdds.c
EXERCISE_FILE = TreeSumOdds.c
COMMON = tree.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testTreeSumOdds

testTreeSumOdds: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testTreeSumOdds $(SRC_FILES)

clean:
	rm -f testTreeSumOdds

