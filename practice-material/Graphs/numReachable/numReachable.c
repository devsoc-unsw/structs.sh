
#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>

#include "Queue.h"
#include "Graph.h"

int getNumReachable(Graph g, int src, bool *visited) {
	visited[src] = true;
	int total = 0;
	for (Vertex v = 0; v < GraphNumVertices(g); v++) {
		if (GraphIsAdjacent(g, src, v) && !visited[v]) {
			total += 1 + getNumReachable(g, v, visited);
		}
	}
	return total;
}

int numReachable(Graph g, int src) {
	bool *visited = malloc(sizeof(bool) * GraphNumVertices(g));
	for (int i = 0; i < GraphNumVertices(g); i++) visited[i] = false;
	visited[src] = true;
	int result = getNumReachable(g, src, visited);
	free(visited);
	return result + 1;
}


