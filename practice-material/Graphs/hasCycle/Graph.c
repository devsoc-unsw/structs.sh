// Implementation of the Undirected Graph ADT

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "Graph.h"

struct graph {
	int nV;
	bool **edges;
};

static bool validVertex(Graph g, Vertex v);

////////////////////////////////////////////////////////////////////////
// Constructors

static Graph doGraphNew(int nV);

Graph GraphNew(int nV) {
	assert(nV > 0);
	
	Graph g = doGraphNew(nV);
	for (Vertex v = 0; v < nV; v++) {
		for (Vertex w = 0; w < nV; w++) {
			g->edges[v][w] = false;
		}
	}
	
	return g;
}

Graph GraphNewFromMatrix(int nV, bool edges[nV][nV]) {
	assert(nV > 0);
	
	Graph g = doGraphNew(nV);
	for (Vertex v = 0; v < nV; v++) {
		for (Vertex w = 0; w < nV; w++) {
			if (edges[v][w] == true) {
				assert(v != w);
				assert(edges[w][v] == true);
				g->edges[v][w] = true;
			} else {
				g->edges[v][w] = false;
			}
		}
	}
	
	return g;
}

Graph GraphNewFromEdgeArray(int nV, int nE, Edge *edges) {
	assert(nV > 0);
	assert(nE >= 0);
	
	Graph g = GraphNew(nV);
	for (int i = 0; i < nE; i++) {
		Vertex v = edges[i].v;
		Vertex w = edges[i].w;
		assert(validVertex(g, v));
		assert(validVertex(g, w));
		assert(v != w);
		g->edges[v][w] = true;
		g->edges[w][v] = true;
	}
	
	return g;
}

Graph GraphRead(void) {
	printf("Enter number of vertices: ");
	int nV;
	scanf("%d", &nV);
	Graph g = GraphNew(nV);
	
	printf("Enter number of edges: ");
	int maxE;
	scanf("%d", &maxE);
	assert(maxE >= 0);
	
	int nE = 0;
	printf("Enter edges in the form v-w: ");
	int v, w;
	while (nE < maxE && scanf("%d-%d", &v, &w) == 2) {
		assert(v >= 0 && v < nV);
		assert(w >= 0 && w < nV);
		assert(v != w);
		
		if (GraphIsAdjacent(g, v, w)) {
			printf("WARNING: edge %d-%d already exists in the graph\n",
			       v, w);
		}
		
		GraphAddEdge(g, v, w);
		nE++;
	}
	
	return g;
}

Graph GraphCopy(Graph g) {
	Graph copy = doGraphNew(g->nV);
	for (Vertex v = 0; v < g->nV; v++) {
		for (Vertex w = 0; w < g->nV; w++) {
			copy->edges[v][w] = g->edges[v][w];
		}
	}
	return copy;
}

static Graph doGraphNew(int nV) {
	Graph g = malloc(sizeof(*g));
	if (g == NULL) {
		fprintf(stderr, "GraphNew: Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}
	
	g->nV = nV;
	
	g->edges = malloc(nV * sizeof(bool *));
	if (g->edges == NULL) {
		fprintf(stderr, "GraphNew: Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}
	for (Vertex v = 0; v < nV; v++) {
		g->edges[v] = malloc(nV * sizeof(bool));
		if (g->edges[v] == NULL) {
			fprintf(stderr, "GraphNew: Insufficient memory!\n");
			exit(EXIT_FAILURE);
		}
	}
	
	return g;
}

////////////////////////////////////////////////////////////////////////
// Destructors

void GraphFree(Graph g) {
	assert(g != NULL);
	
	for (Vertex v = 0; v < g->nV; v++) {
		free(g->edges[v]);
	}
	free(g->edges);
	free(g);
}

////////////////////////////////////////////////////////////////////////
// General Graph Functions

int GraphNumVertices(Graph g) {
	assert(g != NULL);
	
	return g->nV;
}

void GraphAddEdge(Graph g, Vertex v, Vertex w) {
	assert(g != NULL);
	assert(validVertex(g, v));
	assert(validVertex(g, w));
	assert(v != w);
	
	g->edges[v][w] = true;
	g->edges[w][v] = true;
}

void GraphRemoveEdge(Graph g, Vertex v, Vertex w) {
	assert(g != NULL);
	assert(validVertex(g, v));
	assert(validVertex(g, w));
	assert(v != w);
	
	g->edges[v][w] = false;
	g->edges[w][v] = false;
}

bool GraphIsAdjacent(Graph g, Vertex v, Vertex w) {
	assert(g != NULL);
	assert(validVertex(g, v));
	assert(validVertex(g, w));
	
	return g->edges[v][w];
}

////////////////////////////////////////////////////////////////////////
// Displaying the Graph

void GraphDump(Graph g, FILE *fp) {
	assert(g != NULL);
	assert(fp != NULL);
	
	fprintf(fp, "\nGraph: nV = %d\n", g->nV);
	fprintf(fp, "Edges:\n");
	for (Vertex v = 0; v < g->nV; v++) {
		fprintf(fp, "%2d:", v);
		for (Vertex w = 0; w < g->nV; w++) {
			if (g->edges[v][w] == true) {
				fprintf(fp, " %d-%d", v, w);
			}
		}
		fprintf(fp, "\n");
	}
	fprintf(fp, "\n");
}

////////////////////////////////////////////////////////////////////////
// Helper Functions

static bool validVertex(Graph g, Vertex v) {
	return (v >= 0 && v < g->nV);
}

