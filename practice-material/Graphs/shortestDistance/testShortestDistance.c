
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"

int shortestDistance(Graph g, int src, int dest);

int main(void) {
	Graph g = GraphRead();
	GraphDump(g, stdout);
	
	printf("Enter two vertices: ");
	int src = 0;
	int dest = 0;
	while (scanf("%d %d", &src, &dest) == 2) {
		int dist = shortestDistance(g, src, dest);
		if (dist < 0) {
			printf("There is no path between vertices %d and %d\n",\
			       src, dest);
		} else {
			printf("The shortest distance between vertices %d and %d "
			       "is: %d\n",
			       src, dest, dist);
		}
		
		printf("Enter two vertices: ");
		src = 0;
		dest = 0;
	}
	
	GraphFree(g);
}

