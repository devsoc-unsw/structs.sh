
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"

int numWithin(Graph g, int src, int dist);

int main(void) {
	Graph g = GraphRead();
	GraphDump(g, stdout);

	int src;
	int dist;
	printf("Enter the source vertex and maximum distance: ");
	while (scanf("%d %d", &src, &dist) == 2) {
		int result = numWithin(g, src, dist);
		printf("numWithin(g, %d, %d) = %d\n",
		       src, dist, result);
		printf("Enter the source vertex and maximum distance: ");
	}
	
	GraphFree(g);
}

