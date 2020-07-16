#ifndef DIJKSTRA
#define DIJKSTRA

// Dijkstra's Algorithm for shortest path spanning tree
void dijkstra(Graph g, Vertex src);
Vertex getLowestCostVertex(Graph g, int *dist, bool *included);
void showPathTrace(Vertex src, Vertex dest, int *pred);
int showShortestPaths(Graph g, int src, int dist[], int *pred);

#endif
