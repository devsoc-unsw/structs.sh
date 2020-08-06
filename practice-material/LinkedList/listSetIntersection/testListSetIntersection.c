
#include <stdio.h>

#include "list.h"

List listSetIntersection(List s1, List s2);

static void checkRules(NodeData *before, NodeData *after);

int main(void) {
	printf("Enter list 1: ");
	List l1 = readList();
	NodeData *before1 = getListNodeData(l1);
	
	printf("Enter list 2: ");
	List l2 = readList();
	NodeData *before2 = getListNodeData(l2);
	
	List l3 = listSetIntersection(l1, l2);
	NodeData *after1 = getListNodeData(l1);
	NodeData *after2 = getListNodeData(l2);
	printf("\n");
	
	printf("Set 1: ");
	printListSet(l1);
	printf("Set 2: ");
	printListSet(l2);
	printf("Intersection: ");
	List sortedl3 = listSortedCopy(l3);
	printListSet(sortedl3);
	
	checkRules(before1, after1);
	checkRules(before2, after2);
	free(before1);
	free(before2);
	free(after1);
	free(after2);
	freeList(l1);
	freeList(l2);
	freeList(l3);
	freeList(sortedl3);
}

static void checkRules(NodeData *before, NodeData *after) {
	if (!notModified(before, after)) {
		printf("Error: An input list was modified. You should not "
		       "modify the given lists.\n");
	}
}

