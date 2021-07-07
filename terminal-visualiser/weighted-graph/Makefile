CC=gcc
CFLAGS= -g
OBJS=main.o graph.o graph-algos.o dijkstra.o ../graph-helpers/queue/Queue.o ../graph-helpers/stack/Stack.o ../graph-helpers/priority-queue/PQueue.o ../graph-helpers/linked-list/List.o ../util/menu-interface.o ../util/display/display.o ../util/utilities/processing.o

testGraph : $(OBJS)
	$(CC) -o testGraph $(OBJS)

processing.o: ../util/utilities/processing.c ../util/utilities/processing.h
display.o: ../util/display/display.c ../util/display/display.h
menu-interface.o: ../util/menu-interface.c ../util/menu-interface.h
main.o : main.c graph.h
graph-algos.o:    graph-algos.c graph-algos.h
dijkstra.o : dijkstra.c dijkstra.h
graph.o  : graph.c graph.h ../graph-helpers/queue/Queue.h ../graph-helpers/stack/Stack.h ../graph-helpers/linked-list/List.h
Queue.o  : ../graph-helpers/queue/Queue.c ../graph-helpers/queue/Queue.h ../graph-helpers/queue/Item.h
Stack.o  : ../graph-helpers/stack/Stack.c ../graph-helpers/stack/Stack.h ../graph-helpers/queue/Item.h
PQueue.o : ../graph-helpers/priority-queue/PQueue.c ../graph-helpers/priority-queue/PQueue.h ../graph-helpers/priority-queue/Item.h
List.o   : ../graph-helpers/linked-list/List.c ../graph-helpers/linked-list/List.h ../graph-helpers/linked-list/Item.h

clean :
	rm -f testGraph $(OBJS) core *.dSYM
