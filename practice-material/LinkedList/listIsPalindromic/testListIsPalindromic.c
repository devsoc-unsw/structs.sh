
#include <stdio.h>

#include "list.h"

bool listIsPalindromic(List l);

static void checkRules(NodeData *before, NodeData *after);

int main(void) {
	printf("Enter list: ");
	List l = readList();
	NodeData *before = getListNodeData(l);
	
	bool result = listIsPalindromic(l);
	printf("listIsPalindromic returned %s\n",
	       result ? "TRUE" : "FALSE");
	
	NodeData *after = getListNodeData(l);
	checkRules(before, after);
	free(before);
	free(after);
	freeList(l);
}

static void checkRules(NodeData *before, NodeData *after) {
	if (!notModified(before, after)) {
		printf("Error: The list was modified. You should not "
		       "modify the given list.\n");
	}
}

