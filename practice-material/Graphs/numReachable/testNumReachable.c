
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"

int numReachable(Graph g, int src);

int main(void) {
	Graph g = GraphRead();
	GraphDump(g, stdout);
	
	printf("Enter the source vertex: ");
	int src;
	while (scanf("%d", &src) == 1) {
		int result = numReachable(g, src);
		printf("Number of vertices reachable from vertex %d: %d\n",
		       src, result);
		printf("Enter the source vertex: ");
	}
	
	GraphFree(g);
}

