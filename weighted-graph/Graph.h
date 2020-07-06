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
typedef struct { 
   Vertex v;
   Vertex w;
   int    weight;
} Edge;

// Basic Graph Operations:
int   validV(Graph g, Vertex v); 
Edge  makeEdge(Graph g, Vertex v, Vertex w, int weight);
Graph newGraph(int nV); 
bool  adjacent(Graph g, Vertex v, Vertex w);
int   getWeight(Graph g, Vertex v, Vertex w);
void  insertE(Graph, Edge);
void  removeE(Graph, Edge);
void  dropGraph(Graph);
void  show(Graph, int option);

#endif
