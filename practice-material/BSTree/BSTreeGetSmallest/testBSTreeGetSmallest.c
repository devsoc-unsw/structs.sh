
#include <stdio.h>
#include <stdlib.h>

#include "BSTree.h"

BSTree BSTreeGetSmallest(BSTree t);

int main(void) {
	BSTree t = readBSTree(0);
	printf("\n");
	
	printf("Tree:\n");
	printBSTree(t);
	
	BSTree smallest = BSTreeGetSmallest(t);
	printf("BSTreeGetSmallest returned: ");
	if (smallest == NULL) {
		printf("NULL\n");
	} else {
		printf("%d\n", smallest->value);
	}
	
	freeBSTree(t);
}

