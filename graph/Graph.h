#ifndef GRAPH_H
#define GRAPH_H

// graph representation is hidden
typedef struct GraphRep *Graph;

// vertices denoted by integers 0..N-1
typedef unsigned int Vertex;
int   validV(Graph,Vertex); //validity check

// edges are pairs of vertices (end-points)
typedef struct { Vertex v; Vertex w; } Edge;
Edge mkEdge(Graph, Vertex, Vertex);

// operations on graphs
Graph newGraph(int nV);  // #vertices
Graph newRandomGraph(int nV);  // #vertices
void  insertE(Graph, Edge);
void  removeE(Graph, Edge);
// returns #vertices & array of edges
int   edges(Graph, Edge *, int);
Graph copy(Graph);
void  dropGraph(Graph);
void  show(Graph);

// DFS Algorithms on Graphs
void dfs(Graph, Vertex);
int dfsHasPath(Graph, Vertex, Vertex);
void dfsFindPath(Graph, Vertex, Vertex);
int hasCycle(Graph);
void components(Graph);

// BFS Algorithms on Graphs
void bfs(Graph, Vertex);
void bfsShow(Graph, Vertex);
int hasPath(Graph, Vertex, Vertex);
void findPath(Graph, Vertex, Vertex);
int hasHamiltonPath(Graph, Vertex, Vertex);

#endif
