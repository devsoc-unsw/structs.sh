
#include <stdio.h>
#include <stdlib.h>

#include "tree.h"

bool TreeIsPerfectlyBalanced(Tree t);

int main(void) {
	Tree t = readTree(0);
	
	printf("Tree:\n");
	printTree(t);
	
	bool result = TreeIsPerfectlyBalanced(t);
	printf("TreeIsPerfectlyBalanced returned: %s\n",
	       result ? "TRUE" : "FALSE");
	
	freeTree(t);
}

