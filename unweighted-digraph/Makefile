CC=gcc
CFLAGS= -g
OBJS=main.o Graph.o graph-algos.o floyd-warshall.o queue/Queue.o stack/Stack.o priority-queue/PQueue.o linked-list/List.o ../util/menu-interface.o ../util/display/display.o ../util/utilities/processing.o

testGraph : $(OBJS)
	$(CC) -o testGraph $(OBJS)

processing.o: ../util/utilities/processing.c ../util/utilities/processing.h
display.o: ../util/display/display.c ../util/display/display.h
menu-interface.o: ../util/menu-interface.c ../util/menu-interface.h
main.o : main.c Graph.h
graph-algos.o:    graph-algos.c graph-algos.h
floyd-warshall.o: floyd-warshall.c floyd-warshall.h
Graph.o  : Graph.c Graph.h queue/Queue.h stack/Stack.h linked-list/List.h
Queue.o  : queue/Queue.c queue/Queue.h queue/Item.h
Stack.o  : stack/Stack.c stack/Stack.h queue/Item.h
PQueue.o : priority-queue/PQueue.c priority-queue/PQueue.h priority-queue/Item.h
List.o   : linked-list/List.c linked-list/List.h linked-list/Item.h

clean :
	rm -f testGraph $(OBJS) core *.dSYM
