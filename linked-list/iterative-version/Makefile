CC=gcc
CFLAGS= -g
OBJS=main.o linked-list.o ../../util/colours.o

testLinkedList : $(OBJS)
	$(CC) -o testLinkedList $(OBJS)

colours.o: ../../util/colours.c ../../util/colours.h
main.o : main.c
linked-list.o   : linked-list.c linked-list.h

clean :
	rm -f testLinkedList $(OBJS) core *.dSYM
