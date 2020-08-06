
#include <stdio.h>
#include <stdlib.h>

#include "BSTree.h"

int BSTreeGetKth(BSTree t, int k);

int main(void) {
	BSTree t = readBSTree(0);
	
	printf("Tree:\n");
	printBSTree(t);
	
	int k;
	printf("Enter k: ");
	while (scanf("%d", &k) == 1) {
		int value = BSTreeGetKth(t, k);
		printf("For k = %d, BSTreeGetKth returned %d\n", k, value);
		printf("Enter k: ");
	}
	
	freeBSTree(t);
}

