CC=gcc
CFLAGS= -g
OBJS=main.o linked-list.o ../../util/colours.o ../../util/menu-interface.o

testLinkedList : $(OBJS)
	$(CC) -o testLinkedList $(OBJS)

colours.o: ../../util/colours.c ../../util/colours.h
menu-interface.o: ../../util/menu-interface.c ../../util/menu-interface.h
main.o : main.c
linked-list.o   : linked-list.c linked-list.h

clean :
	rm -f testLinkedList $(OBJS) core *.dSYM
