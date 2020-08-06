
#include <stdio.h>
#include <stdlib.h>

#include "BSTree.h"

BSTree BSTreeInsert(BSTree t, int val);

int main(void) {
	BSTree t = readBSTree(0);
	
	printf("Enter value to insert: ");
	int val;
	scanf("%d", &val);
	
	printf("BST before inserting %d:\n", val);
	printBSTree(t);
	
	t = BSTreeInsert(t, val);
	
	printf("BST after inserting %d:\n", val);
	printBSTree(t);
	
	freeBSTree(t);
}

