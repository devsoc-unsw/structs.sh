#ifndef GRAPH_ALGOS
#define GRAPH_ALGOS

// Dijkstra's Algorithm for shortest path spanning tree
Vertex getMinDistance(Graph g, int *dist, bool *included);
void dijkstra(Graph g, Vertex src);
void showPathTrace(Vertex src, Vertex dest, int *pred);

// Traversals:
void DFSIterative(Graph, Vertex);
static void DFSR(Graph g, Vertex currVertex, bool *visited);

void DFSRecursive(Graph, Vertex);

void BFS(Graph, Vertex);

// Graph Properties:
bool hasCycle(Graph g);
static bool dfsFindCycle(Graph g, Vertex curr, Vertex pred, bool *visited);

bool isReachable(Graph g, Vertex src, Vertex dest);
static bool checkReachable(Graph g, Vertex src, Vertex dest, bool *visited);

void showConnectedComponents(Graph g);
static void setComponent(Graph g, Vertex curr, int id, int *vertexIDs);

bool hasHamiltonPath(Graph, Vertex, Vertex);
static bool hamiltonPathCheck(Graph g, Vertex v, Vertex w, int d, bool *visited);

// Helpers:
static bool *newVisitedArray(Graph g);
static void showVisited(Graph g, bool *visited);

#endif
