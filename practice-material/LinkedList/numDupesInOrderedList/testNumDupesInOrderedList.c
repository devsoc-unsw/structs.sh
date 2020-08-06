
#include <stdio.h>

#include "list.h"

int numDupesInOrderedList(List l);

void checkRules(NodeData *before, NodeData *after);

int main(void) {
	printf("Enter list: ");
	List l = readList();
	NodeData *before = getListNodeData(l);

	int result = numDupesInOrderedList(l);
	printf("numDupesInOrderedList returned %d\n", result);
	NodeData *after = getListNodeData(l);

	checkRules(before, after);
	free(before);
	free(after);
	freeList(l);
}

void checkRules(NodeData *before, NodeData *after) {
	if (!notModified(before, after)) {
		printf("Error: The list was modified. You should not "
		       "modify the list.\n");
	}
}

