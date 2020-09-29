#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include "Graph.h"
#include "graph-algos.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "../util/display/display.h"

/** 
 * Check vertex is valid
 */
int validV(Graph g, Vertex v) {
   return (g != NULL && v >= 0 && v < g -> nV);
}

/** 
 * Create and return an Edge
 */
Edge makeEdge(Graph g, Vertex v, Vertex w) {
   assert(validV(g, v) && validV(g, w));
   Edge e; 
   e.v = v; 
   e.w = w;
   return e;
}

/** 
 * Instantiates an empty graph
 */
Graph newGraph(int nV) {
   assert(nV > 0);
   int **e = malloc(nV * sizeof(int *));
   assert(e != NULL);
   for (int i = 0; i < nV; i++) {
      e[i] = calloc(nV, sizeof(int));
      assert(e[i] != NULL);
   }
   Graph g = malloc(sizeof(GraphRep));
   assert(g != NULL);
   g -> nV = nV;  g -> nE = 0;  g -> edges = e;
   return g;
}

/** 
 * Initialises a graph with random values
 */
Graph newRandomGraph(int nV) {
   Graph g = newGraph(nV);
   for (int v = 0; v < nV; v++) {
      for (int w = v+1; w < nV; w++) {
         if (rand()%4 == 0)
            insertE(g, makeEdge(g, v, w));
      }
   }
   return g;
}

/** 
 * Checks if the two given vertices are adjacent in the graph
 */
bool adjacent(Graph g, Vertex v, Vertex w) {
   assert(validV(g, v) && validV(g, w));
   return (g -> edges[v][w] != 0);
}

/** 
 * Inserts the given edge into the graph 
 */
void  insertE(Graph g, Edge e) {
   assert(g != NULL);
   assert(validV(g, e.v) && validV(g, e.w));
   if (g -> edges[e.v][e.w]) return;
   g -> edges[e.v][e.w] = 1;
   g -> nE++;
}

/** 
 * Deletes the given edge from the graph
 */
void  removeE(Graph g, Edge e) {
   assert(g != NULL);
   assert(validV(g, e.v) && validV(g, e.w));
   if (!g -> edges[e.v][e.w]) return;
   g -> edges[e.v][e.w] = 0;
   g -> nE--;
}

/** 
 * Frees the memory associated with graph
 */
void dropGraph(Graph g) {
   assert(g != NULL);
   for (int i = 0; i < g -> nV; i++)
      free(g -> edges[i]);
   free(g -> edges);
   free(g);
}

/** 
 * Displays the graph. 
 * Options:
 *   1. ADJACENCY_MATRIX
 *   2. ADJACENCY_LIST
 */
void show(Graph g, int option) {
   assert(g != NULL);
   int v, w;
   switch (option) {
      case ADJACENCY_LIST:
         printf("Showing the adjacency list\n");
         printf("|—————————————————————————|\n");
         printColoured("yellow", " Vertex   Connections\n");
         printf("|—————————————————————————|\n");
         for (v = 0; v < g -> nV; v++) {
            printf("  %-3d   ║", v);
            
            for (w = 0; w < g -> nV; w++) {
               if (adjacent(g, v, w)) printf(" ⟶ %d", w);
            }
            printf("\n");
         }
         break;
      case ADJACENCY_MATRIX:
         printf("Showing the adjacency matrix\n");
         printf("\n     ");
         for (v = 0; v < g -> nV; v++)
         printf("%d ", v);
         printf("\n\n");
         for (v = 0; v < g -> nV; v++) {
            printf("%-2d ║ ", v);
            for (w = 0; w < g -> nV; w++) {
               if (adjacent(g, v, w)) printf("1 ");
               else printf("0 ");
            }
            printf("║\n");
         }
         break;
   }
   printf("\nSummary: the graph has %d vertices and %d edges\n", g -> nV, g -> nE);
}
