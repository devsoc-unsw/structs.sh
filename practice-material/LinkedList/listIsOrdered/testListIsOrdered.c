
#include <stdio.h>

#include "list.h"

bool listIsOrdered(List l);

static void checkRules(NodeData *before, NodeData *after);

int main(void) {
	printf("Enter list: ");
	List l = readList();
	NodeData *before = getListNodeData(l);
	
	bool result = listIsOrdered(l);
	printf("listIsOrdered returned %s\n",
	       result ? "TRUE" : "FALSE");
	NodeData *after = getListNodeData(l);
	
	checkRules(before, after);
	free(before);
	free(after);
	freeList(l);
}

static void checkRules(NodeData *before, NodeData *after) {
	if (!notModified(before, after)) {
		printf("Error: The list was modified. You should not modify "
		       "the list.\n");
	}
}

