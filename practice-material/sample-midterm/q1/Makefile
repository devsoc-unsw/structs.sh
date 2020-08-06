# COMP2521 17s2; Question: getPeaks

CC=gcc
CFLAGS=-Wall -Werror

all: testGetPeaks

testGetPeaks : DLList.o  getPeaks.o testGetPeaks.o
	$(CC) -o testGetPeaks  DLList.o  getPeaks.o testGetPeaks.o

getPeaks.o : getPeaks.c getPeaks.h DLList.h 

testGetPeaks.o : testGetPeaks.c getPeaks.h DLList.h 

clean:
	rm -f testGetPeaks getPeaks.o testGetPeaks.o core
