CC     = gcc
CFLAGS = -g
OBJS   = main.o linked-list.o ../../util/colours.o ../../util/menu-interface.o ../../util/display/display.o ../../util/utilities/processing.o

testLinkedList : $(OBJS)
	$(CC) -o testLinkedList $(OBJS)

main.o:           main.c
colours.o:        ../../util/colours.c ../../util/colours.h
menu-interface.o: ../../util/menu-interface.c ../../util/menu-interface.h
display.o:        ../../util/display/display.c ../../util/display/display.h
processing.o:     ../../util/utilities/processing.c ../../util/utilities/processing.h
linked-list.o:    linked-list.c linked-list.h

clean :
	rm -f testLinkedList $(OBJS) core *.dSYM
