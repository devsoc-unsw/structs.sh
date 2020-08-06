
#include <stdio.h>
#include <stdlib.h>

#include "tree.h"

int TreeSumOdds(Tree t);

int main(void) {
	Tree t = readTree(0);
	
	printf("Tree:\n");
	printTree(t);
	
	int sum = TreeSumOdds(t);
	printf("TreeSumOdds returned %d\n", sum);
	
	freeTree(t);
}

