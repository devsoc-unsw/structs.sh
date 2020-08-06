
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testNumDupesInOrderedList.c
EXERCISE_FILE = numDupesInOrderedList.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testNumDupesInOrderedList

testNumDupesInOrderedList: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testNumDupesInOrderedList $(SRC_FILES)

