# COMP2521, Question: countEven
# Written by Ashesh Mahidadia, October 2017

CC=gcc
CFLAGS=-Wall -Werror

all: testCountEven

testCountEven : countEven.o testCountEven.o
	$(CC) -o testCountEven  BSTree.o  countEven.o testCountEven.o

countEven.o : countEven.c countEven.h BSTree.h 

testCountEven.o : testCountEven.c countEven.h BSTree.h 

clean:
	rm -f testCountEven countEven.o testCountEven.o core
