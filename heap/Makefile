CC=gcc
CFLAGS= -g
OBJS=main.o  ../util/colours.o

testHeap : $(OBJS)
	$(CC) -o testHeap $(OBJS)

colours.o: ../util/colours.c ../util/colours.h
main.o : main.c 

clean :
	rm -f testHeap $(OBJS) core *.dSYM
