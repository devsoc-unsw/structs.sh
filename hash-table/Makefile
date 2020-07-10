CC=gcc
CFLAGS= -g
OBJS=main.o  ../util/colours.o

testHash : $(OBJS)
	$(CC) -o testHash $(OBJS)

colours.o: ../util/colours.c ../util/colours.h
main.o : main.c 

clean :
	rm -f testHash $(OBJS) core *.dSYM
