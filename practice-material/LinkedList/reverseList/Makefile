
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testReverseList.c
EXERCISE_FILE = reverseList.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testReverseList

testReverseList: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testReverseList $(SRC_FILES)

