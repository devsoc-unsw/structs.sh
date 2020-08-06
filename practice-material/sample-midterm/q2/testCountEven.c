/* testCountEven.h 
   Written by Ashesh Mahidadia, October 2017
*/

#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include "BSTree.h"

int countEven(BSTree t);

int main(int argc, char *argv[])
{
	int key;
	BSTree t = newBSTree();

	fprintf(stdout, "Inserted Keys: ");
	while(fscanf(stdin, "%d", &key) == 1){
		t = BSTreeInsert(t, key);
		fprintf(stdout, " %d, ", key);
	}
	fprintf(stdout, "\n");

	int count = countEven(t);

	fprintf(stdout, "countEven is: %d \n", count);

	freeBSTree(t);

	return 0;

}
