
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testReverseDLList.c
EXERCISE_FILE = reverseDLList.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testReverseDLList

testReverseDLList: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testReverseDLList $(SRC_FILES)

