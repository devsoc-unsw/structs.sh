CC=gcc
CFLAGS= -g
OBJS=main.o Graph.o queue/Queue.o stack/Stack.o priority-queue/PQueue.o linked-list/List.o ../util/colours.o

testGraph : $(OBJS)
	$(CC) -o testGraph $(OBJS)

colours.o: ../util/colours.c ../util/colours.h
main.o : main.c Graph.h

Graph.o  : Graph.c Graph.h queue/Queue.h stack/Stack.h linked-list/List.h
Queue.o  : queue/Queue.c queue/Queue.h queue/Item.h
Stack.o  : stack/Stack.c stack/Stack.h queue/Item.h
PQueue.o : priority-queue/PQueue.c priority-queue/PQueue.h priority-queue/Item.h
List.o   : linked-list/List.c linked-list/List.h linked-list/Item.h

clean :
	rm -f testGraph $(OBJS) core *.dSYM
