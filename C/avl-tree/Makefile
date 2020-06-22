testTree: testTree.o tree.o tree-print.o colours.o queue.o
	gcc  -o testTree testTree.o tree.o tree-print.o colours.o queue.o

# Note that gcc's -c option compiles and creates the .o file
testTree.o: testTree.c
	gcc -c testTree.c     

tree.o: tree.c tree.h
	gcc -c tree.c

tree-print.o: tree-print.c tree-print.h
	gcc -c tree-print.c

colours.o: ../util/colours.c ../util/colours.h
	gcc -c ../util/colours.c

queue.o: ./queue/queue.c ./queue/queue.h
	gcc -c ./queue/queue.c

clean: 
	rm *.o
	rm testTree
