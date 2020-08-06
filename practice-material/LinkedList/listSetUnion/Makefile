
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testListSetUnion.c
EXERCISE_FILE = listSetUnion.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testListSetUnion

testListSetUnion: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testListSetUnion $(SRC_FILES)

