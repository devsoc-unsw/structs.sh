main: main.o tree.o tree-print.o ../util/menu-interface.o ../util/display/display.o ../util/utilities/processing.o
	gcc  -o testTree main.o tree.o tree-print.o ../util/menu-interface.o ../util/display/display.o ../util/utilities/processing.o

# Note that gcc's -c option compiles and creates the .o file
main.o: main.c
	gcc -c main.c     

tree.o: tree.c tree.h
	gcc -c tree.c

tree-print.o: tree-print.c tree-print.h
	gcc -c tree-print.c

processing.o: ../util/utilities/processing.c ../util/utilities/processing.h
	gcc -c ../util/utilities/processing.c

menu-interface.o: ../util/menu-interface.c ../util/menu-interface.h
	gcc -c ../util/menu-interface.c

display.o: ../util/display/display.c ../util/display/display.h
	gcc -c ../util/display/display.c

clean :
	rm -f testTree $(OBJS) core *.dSYM
