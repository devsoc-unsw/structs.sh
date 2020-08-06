
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testListDeleteLargest.c
EXERCISE_FILE = listDeleteLargest.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testListDeleteLargest

testListDeleteLargest: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testListDeleteLargest $(SRC_FILES)

