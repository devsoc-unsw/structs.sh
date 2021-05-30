CC=gcc
CFLAGS= -g -w
OBJS=main.o hash-table.o ../util/menu-interface.o ../util/display/display.o ../util/utilities/processing.o

testHash : $(OBJS)
	$(CC) -o testHash $(OBJS)

main.o : main.c 
hash-table.o: hash-table.c hash-table.h

processing.o: ../util/utilities/processing.c ../util/utilities/processing.h
display.o: ../util/display/display.c ../util/display/display.h
menu-interface.o: ../util/menu-interface.c ../util/menu-interface.h

clean :
	rm -f testHash $(OBJS) core *.dSYM
