
#include <stdio.h>

#include "list.h"

void listReverse(List l);

static void checkRules(NodeData *before, NodeData *after);

int main(void) {
	printf("Enter list: ");
	List l = readList();

	printf("Original list: ");
	printList(l);
	NodeData *before = getListNodeData(l);

	listReverse(l);
	printf("Reversed list: ");
	printList(l);
	NodeData *after = getListNodeData(l);

	checkRules(before, after);
	free(before);
	free(after);
	freeList(l);
}

static void checkRules(NodeData *before, NodeData *after) {
	if (!noNewNodes(before, after)) {
		printf("Error: There are new nodes in the reversed list. "
		       "You shouldn't create any new nodes.\n");
	}
	if (!noChangedValues(before, after)) {
		printf("Error: The values in some nodes were changed. You "
		       "should not change the values in any nodes.\n");
	}
}

