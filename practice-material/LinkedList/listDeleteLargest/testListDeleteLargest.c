
#include <stdio.h>

#include "list.h"

int listDeleteLargest(List l);

static void checkRules(NodeData *before, NodeData *after);

int main(void) {
	printf("Enter list: ");
	List l = readList();
	printf("\n");

	printf("Original list: ");
	printList(l);
	NodeData *before = getListNodeData(l);

	int val = listDeleteLargest(l);
	printf("After deleting largest: ");
	printList(l);
	printf("The largest value was: %d\n", val);
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
		printf("Error: You changed the values in some nodes. You "
		       "should not change the values in any nodes.\n");
	}
}

