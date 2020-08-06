
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testListIsPalindromic.c
EXERCISE_FILE = listIsPalindromic.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testListIsPalindromic

testListIsPalindromic: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testListIsPalindromic $(SRC_FILES)

