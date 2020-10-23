#ifndef GRAPH
#define GRAPH

#include <stdbool.h>

#define ADJACENCY_LIST   0
#define ADJACENCY_MATRIX 1

// Struct definitions:
typedef struct GraphRep {
   int   nV;    
   int   nE;    
   int **edges; 
} GraphRep;
typedef struct GraphRep *Graph;
typedef unsigned int Vertex;
typedef struct { Vertex v; Vertex w; } Edge;

/**
 * Checks vertex is valid within the given graph
 */
int validV(Graph, Vertex);

/**
 * Creates an edge object between two vertices. Assumes that
 * the vertices are valid
 */
Edge makeEdge(Graph, Vertex, Vertex);

/**
 * Initialises and returns a new graph structure with the given
 * number of vertices
 */
Graph newGraph(int nV);

/**
 * RANDOMISE: randomise dense|sparse
 * Initialises and returns a new graph structure populated with
 * random edges between edges. 
 * Sparsity factor determines how sparse the graph connections are
 */
Graph newRandomGraph(int nV, int sparsityFactor);  

/**
 * Determines whether 2 vertices are adjacent to each other
 */
bool adjacent(Graph g, Vertex v, Vertex w);

/**
 * MATRIX:  matrix
 * LIST:    list
 * Shows the internal representation of the graph with the following 
 * options:
 *   1. ADJACENCY_MATRIX
 *   2. ADJACENCY_LIST
 */
void showGraph(Graph, int option);
static void showAdjacencyMatrix(Graph g);
static void showAdjacencyList(Graph g);

/**
 * INSERT: insert <v1>-<v2>
 * Inserts the given edge into the graph. Rejects invalid edges.
 * Updates the internal representation of the graph
 */
void insertE(Graph, Edge);

/**
 * REMOVE: remove <v1>-<v2>
 * Removes the given edge from the graph. Rejects invalid edges.
 * Updates the internal representation of the graph
 */
void removeE(Graph, Edge);

/**
 * CLEAR: clear
 * Frees memory associated with the graph structure
 */
void dropGraph(Graph);

// Utilities:
/**
 * Gets the fattest possible cell spacing based on the maximum number
 * of digits in the adjacency matrix weights or the number of vertices
 */
int getCellSpacing(int numVertices, int **adjMatrix);

/**
 * Gets a formatted string of connections from a src vertex. Eg.
 * 2 -> 5 -> 10 -> 13
 */
char *getConnectionsString(Graph g, Vertex src);

#endif
