// Interface  for  an Undirected Graph ADT where vertices are identified
// by integers between 0 and N - 1, where N is the number of vertices.

#ifndef GRAPH_H
#define GRAPH_H

#include <stdbool.h>

typedef int Vertex;
typedef struct {
	Vertex v;
	Vertex w;
} Edge;

typedef struct graph *Graph;

////////////////////////////////////////////////////////////////////////
// Constructors

/**
 * Creates  a  new graph with the given number of vertices and no edges.
 * @param nV - the number of vertices
 */
Graph GraphNew(int nV);

/**
 * Creates a new graph with edges as given in the boolean matrix.
 * @param nV - the number of vertices
 * @param edges - a  matrix of booleans indicating which edges the graph
 *                should contain (true|1 = edge, false|0 = no edge)
 * @pre - for all v, edges[v][v] is false
 *
 * Example Usage:
 *  bool edges[4][4] = {
 *  	{0, 1, 0, 1},
 *  	{1, 0, 1, 0},
 *  	{0, 1, 0, 1},
 *  	{1, 0, 1, 0}
 *  };
 *  Graph g = GraphNewFromMatrix(4, edges);
 */
Graph GraphNewFromMatrix(int nV, bool edges[nV][nV]);

/**
 * Creates a new graph with edges as given in the array of edges.
 * @param nV - the number of vertices
 * @param nE - the number of edges
 * @param edges - an  array of edges, where each edge is an array of two
 *                vertices
 * @pre - for all edges {v, w}, v != w
 *
 * Example Usage:
 *  Edge edges[] = {
 *  	{0, 1}, {1, 2}, {2, 3}, {3, 0}
 *  };
 *  Graph g = GraphNewFromEdgeArray(4, 4, edges);
 */
Graph GraphNewFromEdgeArray(int nV, int nE, Edge *edges);


/**
 * Reads in a graph from stdin
 */
Graph GraphRead(void);

/**
 * Creates a copy of the given graph.
 */
Graph GraphCopy(Graph g);

////////////////////////////////////////////////////////////////////////
// Destructors

/**
 * Frees all the memory allocated for the given graph.
 * @param g - the graph to be freed
 */
void GraphFree(Graph g);

////////////////////////////////////////////////////////////////////////
// General Graph Functions

/**
 * Returns the number of vertices in the given graph.
 */
int GraphNumVertices(Graph g);

/**
 * Adds  an  undirected edge between two vertices to the given graph. If
 * the  edge  already  exists, this  function does nothing. Assumes that
 * v != w.
 */
void GraphAddEdge(Graph g, Vertex v, Vertex w);

/**
 * Removes an undirected edge between two vertices from the given graph.
 * If  the edge does not exist, this function does nothing. Assumes that
 * v != w.
 */
void GraphRemoveEdge(Graph g, Vertex v, Vertex w);

/**
 * Checks  whether  two vertices are adjacent to each other in the given
 * graph. Returns true or false as appropriate.
 */
bool GraphIsAdjacent(Graph g, Vertex v, Vertex w);

////////////////////////////////////////////////////////////////////////
// Displaying the Graph

void GraphDump(Graph g, FILE *fp);

#endif


