CC=gcc
CFLAGS= -g
OBJS=main.o heap.o queue/queue.o ../util/menu-interface.o ../util/display/display.o ../util/utilities/processing.o

testHeap : $(OBJS)
	$(CC) -o testHeap $(OBJS)

main.o : main.c 
queue.o: queue/queue.c queue/queue.h queue/item.h
heap.o: heap.c heap.h

processing.o: ../util/utilities/processing.c ../util/utilities/processing.h
display.o: ../util/display/display.c ../util/display/display.h
menu-interface.o: ../util/menu-interface.c ../util/menu-interface.h

clean :
	rm -f testHeap $(OBJS) core *.dSYM
