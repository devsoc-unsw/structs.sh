
CC = gcc
CFLAGS = -Wall -Werror -std=c11 -g

TEST_DRIVER = testListIsOrdered.c
EXERCISE_FILE = listIsOrdered.c
COMMON = list.c

SRC_FILES = $(TEST_DRIVER) $(EXERCISE_FILE) $(COMMON)

all: testListIsOrdered

testListIsOrdered: $(SRC_FILES)
	$(CC) $(CFLAGS) -o testListIsOrdered $(SRC_FILES)

