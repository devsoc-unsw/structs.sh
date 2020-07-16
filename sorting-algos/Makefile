testSort: main.o sort.o colours.o heap.o
	gcc  -o testSort main.o sort.o colours.o heap.o

main.o: main.c
	gcc -c main.c     

sort.o: sort.c
	gcc -c sort.c

heap.o: ../heap/heap.c ../heap/heap.h
	gcc -c ../heap/heap.c

colours.o: ../util/colours.c ../util/colours.h
	gcc -c ../util/colours.c
	
clean: 
	rm *.o
	rm testSort
