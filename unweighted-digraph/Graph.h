#ifndef GRAPH
#define GRAPH

#include <stdbool.h>

#define ADJACENCY_LIST   0
#define ADJACENCY_MATRIX 1

typedef struct GraphRep {
   int   nV;    
   int   nE;    
   int **edges; 
} GraphRep;
typedef struct GraphRep *Graph;
typedef unsigned int Vertex;
typedef struct { Vertex v; Vertex w; } Edge;

// Basic Graph Operations:
int   validV(Graph, Vertex); 
Edge  makeEdge(Graph, Vertex, Vertex);
Graph newGraph(int nV); 
Graph newRandomGraph(int nV, int sparsityFactor);  
bool  adjacent(Graph g, Vertex v, Vertex w);
void  insertE(Graph, Edge);
void  removeE(Graph, Edge);
void  dropGraph(Graph);
void  show(Graph, int option);

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
