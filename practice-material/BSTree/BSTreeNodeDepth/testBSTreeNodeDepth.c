
#include <stdio.h>
#include <stdlib.h>

#include "BSTree.h"

int BSTreeNodeDepth(BSTree t, int key);

int main(void) {
	BSTree t = readBSTree(0);
	
	printf("Tree:\n");
	printBSTree(t);
	
	int key;
	printf("Enter key: ");
	while (scanf("%d", &key) == 1) {
		int depth = BSTreeNodeDepth(t, key);
		printf("For key = %d, BSTreeNodeDepth returned %d\n", key, depth);
		printf("Enter key: ");
	}
	
	freeBSTree(t);
}

