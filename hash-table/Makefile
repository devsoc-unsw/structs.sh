CC=gcc
CFLAGS= -g -w
OBJS=main.o hash-table.o ../util/colours.o

testHash : $(OBJS)
	$(CC) -o testHash $(OBJS)

colours.o: ../util/colours.c ../util/colours.h
main.o : main.c 
hash-table.o: hash-table.c hash-table.h

clean :
	rm -f testHash $(OBJS) core *.dSYM
