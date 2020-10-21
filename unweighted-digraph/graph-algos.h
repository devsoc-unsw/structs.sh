#ifndef GRAPH_ALGOS
#define GRAPH_ALGOS

// ===== Traversals =====

/**
 * DFS: dfs <v1> 
 * Performs a depth first search from the given starting vertex
 */
void dfs(Graph, Vertex);
static void dfsRecursive(Graph g, Vertex currVertex, bool *visited);

/**
 * BFS: bfs <v1>  
 * Performs a breadth first search from the given starting vertex
 */
void bfs(Graph, Vertex);

// ===== Graph Properties =====

/**
 * CYCLE: cycle
 * Checks whether a cycle exists in the graph
 */
bool hasCycle(Graph g);

// Helper function for hasCycle
static bool dfsFindCycle(Graph g, Vertex curr, Vertex pred, bool *visited);

/**
 * PATH: path <v1> <v2>
 * Checks whether a path exists between the two vertices
 */
bool isReachable(Graph g, Vertex src, Vertex dest);

// Helper function for isReachable
static bool checkReachable(Graph g, Vertex src, Vertex dest, bool *visited);

/**
 * CONNECTED: connected
 * Lists every isolated subgraph and their vertices within the graph
 */
void showConnectedComponents(Graph g);

// Helper function for showConnectedComponents
static void setComponent(Graph g, Vertex curr, int id, int *vertexIDs);

/**
 * HAMILTON: hamilton <v1> <v2> 
 * Determines whether or not a Hamilton path exists between the two vertices
 */
bool hasHamiltonPath(Graph, Vertex, Vertex);

// Helper function for hasHamiltonPath
static bool hamiltonPathCheck(Graph g, Vertex v, Vertex w, int d, bool *visited);

// ===== Helper Functions =====

/**
 * Mallocates a bool array for tracking whether each node of the graph
 * has been visited or not
 */
static bool *newVisitedArray(Graph g);

/**
 * Prints the visited vertices
 */
static void showVisited(Graph g, bool *visited);

/**
 * Prints out a pretty structure illustrating the traversal paths
 * taken from a starting vertex
 */
void showTraversalTrace(Graph g, Vertex startingVertex);
static void traversalTracer(Graph g, Vertex currVertex, bool *visited, int indentLevel, bool *levelConnector);

/**
 * Given a starting vertex and an array for tracking visited nodes,
 * follows every path from that starting vertex and marks each vertex
 * crossed as visited  
 */
static void markVisited(Graph g, Vertex startVertex, bool *visited);

/**
 * Given a starting vertex, returns the number of paths this vertex
 * must diverge to
 */
static int numNextHops(Graph g, Vertex startVertex, bool *visited);

#endif
