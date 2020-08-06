
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testListSetIntersection.c
EXERCISE_FILE = listSetIntersection.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testListSetIntersection

testListSetIntersection: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testListSetIntersection $(SRC_FILES)

