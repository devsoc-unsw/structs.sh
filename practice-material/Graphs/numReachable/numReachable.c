
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "Queue.h"
#include "Graph.h"

int getNumReachable(Graph g, int src, bool *visited) {
	visted[src] = true;
	int total = 0;
	for (Vertex v = 0; v < GraphNumVertices(g); v++) {
		if (GraphIsAdjacent(g, src, v) && !visited[src]) {
			total +=  
		}
	}
	return total;
}

int numReachable(Graph g, int src) {

}


