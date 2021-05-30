#ifndef DIJKSTRA
#define DIJKSTRA

/**
 * DIJKSTRA: dijkstra <vertex>
 * 
 * Dijkstra's algorithm for determining the single source spanning tree
 * of the input graph from the starting vertex
 * 
 * High-level steps:
 *   1. Look at every neighbour of the vertices we currently have in vSet
 *   2. Find the neighbour vertex with the lowest cost to get to and 
 *      include it in our set of vertices
 *   3. Look at all the unincluded neighbours of the new vertex, and
 *      update the dist array if we've found a BETTER path to those neighbours
 *   4. Repeat 1-3 until all vertices have been included in vSet
 */
void dijkstra(Graph g, Vertex src);

// ===== Dijkstra helpers =====
/**
 * Determines the next lowest cost vertex of the unincluded vertices
 */
Vertex getLowestCostVertex(Graph g, int *dist, bool *included);

/**
 * Shows the path traced by the predecessor array
 */
void showPathTrace(Vertex src, Vertex dest, int *pred);

/**
 * Show the shortest paths computed by Dijkstra's algorithm
 */
int showShortestPaths(Graph g, int src, int dist[], int *pred);

#endif
