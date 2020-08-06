
#include <stdio.h>

#include "list.h"

void reverseDLList(List l);

void checkRules(NodeData *before, NodeData *after);

int main(void) {
	printf("Enter list: ");
	List l = readList();

	printf("\nOriginal list:\n");
	printList(l);
	NodeData *before = getListNodeData(l);

	reverseDLList(l);
	printf("\nReversed list:\n");
	printList(l);
	NodeData *after = getListNodeData(l);
	
	checkValidity(l);

	checkRules(before, after);
	free(before);
	free(after);
	freeList(l);
}

void checkRules(NodeData *before, NodeData *after) {
	if (!noNewNodes(before, after)) {
		printf("Error: There are new nodes in the reversed list. "
		       "You shouldn't create any new nodes.\n");
	}
	if (!noChangedValues(before, after)) {
		printf("Error: You changed the values in some nodes. You "
		       "should not change the values in any nodes.\n");
	}
}

