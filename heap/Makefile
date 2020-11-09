CC=gcc
CFLAGS= -g
OBJS=main.o  heap.o ../util/colours.o queue/queue.o

testHeap : $(OBJS)
	$(CC) -o testHeap $(OBJS)

colours.o: ../util/colours.c ../util/colours.h
main.o : main.c 
queue.o: queue/queue.c queue/queue.h queue/item.h
heap.o: heap.c heap.h

clean :
	rm -f testHeap $(OBJS) core *.dSYM
