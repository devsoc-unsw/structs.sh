#ifndef GRAPH_ALGOS
#define GRAPH_ALGOS

// Traversals:
void DFSIterative(Graph, Vertex);

void DFSRecursive(Graph, Vertex);
static void DFSRecursiveStacktracer(Graph g, Vertex currVertex, bool *visited, int indentLevel, bool *levelConnector);
static void DFSRecursivePrint(Graph g, Vertex currVertex, bool *visited);

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
