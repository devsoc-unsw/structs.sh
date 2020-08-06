
#include <stdio.h>
#include <stdlib.h>

#include "BSTree.h"

void BSTreePostfix(BSTree t);

int main(void) {
	BSTree t = readBSTree(0);
	
	printf("Tree:\n");
	printBSTree(t);
	
	printf("Values in postfix order: ");
	BSTreePostfix(t);
	printf("\n");
	
	freeBSTree(t);
}

