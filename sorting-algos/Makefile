testSort: main.o sort.o colours.o heap.o menu-interface.o display.o processing.o
	gcc  -o testSort main.o sort.o colours.o heap.o menu-interface.o display.o processing.o

# Note that gcc's -c option compiles and creates the .o file
main.o: main.c
	gcc -c main.c     

sort.o: sort.c
	gcc -c sort.c

heap.o: ../heap/heap.c ../heap/heap.h
	gcc -c ../heap/heap.c

colours.o: ../util/colours.c ../util/colours.h
	gcc -c ../util/colours.c

processing.o: ../util/utilities/processing.c ../util/utilities/processing.h
	gcc -c ../util/utilities/processing.c

menu-interface.o: ../util/menu-interface.c ../util/menu-interface.h
	gcc -c ../util/menu-interface.c

display.o: ../util/display/display.c ../util/display/display.h
	gcc -c ../util/display/display.c

clean: 
	rm *.o
	rm testSort
