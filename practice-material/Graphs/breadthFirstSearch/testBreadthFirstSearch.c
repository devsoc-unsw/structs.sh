
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"

void breadthFirstSearch(Graph g, int src);

int main(void) {
	Graph g = GraphRead();
	GraphDump(g, stdout);
	
	printf("Enter src: ");
	int src;
	scanf("%d", &src);
	
	printf("Breadth first search starting at vertex %d: ", src);
	breadthFirstSearch(g, src);
	printf("\n");
	
	GraphFree(g);
}

