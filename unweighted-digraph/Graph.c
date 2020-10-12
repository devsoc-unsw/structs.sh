#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>
#include "Graph.h"
#include "graph-algos.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"

#define MAX_VERTICES              50
#define MAX_SEGMENT_LENGTH        12
#define MAX_CONNECTION_STRING_LEN MAX_VERTICES * MAX_SEGMENT_LENGTH

#define max(a, b) (a > b) ? a : b


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
         printHorizontalRule();
         printColoured("yellow", " Vertex   Connections\n");
         printHorizontalRule();
         for (v = 0; v < g -> nV; v++) {
            printf("    %3d %s", v, BOX_EDGE_CHAR_VERTICAL);
            char *connections = getConnectionsString(g, v);
            if (strlen(connections) + 8 >= getTermWidth()) {   // Note: the +8 comes from the width of the left column of vertices 
               printColoured("red", "Too many to print\n");
               continue;
            }
            printf("%s\n", connections);
            free(connections);
         }
         printHorizontalRule();
         break;
      case ADJACENCY_MATRIX:
         printf("Showing the adjacency matrix\n");
         int cellSpacing = getCellSpacing(g -> nV, g -> edges);
         int horizontalBorderWidth = (cellSpacing + 1) * (g -> nV) + 1;
         if (horizontalBorderWidth + 3 >= getTermWidth()) {   // Note: the +3 comes from the left column of row numbers
            printColoured("red", "The matrix is too large to be printed here. Sorry\n");
            return;
         }

         printHorizontalRule();
         printf("\n     ");
         // Printing upper row of column numbers
         for (v = 0; v < g -> nV; v++) printColoured("yellow", "%-*d ", cellSpacing, v);
         printf("\n");
         // Printing upper matrix border
         printf("   %s", BOX_EDGE_CHAR_TOP_LEFT);
         for (v = 0; v < (cellSpacing + 1) * (g -> nV) + 1; v++) printf("%s", BOX_EDGE_CHAR_HORIZONTAL);
         printf("%s\n", BOX_EDGE_CHAR_TOP_RIGHT);
         for (v = 0; v < g -> nV; v++) {
            printColoured("yellow", "%-2d %s ", v, BOX_EDGE_CHAR_VERTICAL);
            for (w = 0; w < g -> nV; w++) {
               if (adjacent(g, v, w)) printColoured("green", "%-*d ", cellSpacing, 1);
               else printColoured("purple", "%-*d ", cellSpacing, 0);
            }
            printf("%s\n", BOX_EDGE_CHAR_VERTICAL);
         }
         // Printing lower matrix border
         printf("   %s", BOX_EDGE_CHAR_BOTTOM_LEFT);
         for (v = 0; v < (cellSpacing + 1) * (g -> nV) + 1; v++) printf("%s", BOX_EDGE_CHAR_HORIZONTAL);
         printf("%s\n", BOX_EDGE_CHAR_BOTTOM_RIGHT);
         printHorizontalRule();
         break;
   }
   printf("\nSummary: the graph has %d vertices and %d edges\n", g -> nV, g -> nE);
}

int getCellSpacing(int numVertices, int **adjMatrix) {
   int cellSpacing = 0;
   for (int row = 0; row < numVertices; row++) {
      for (int col = 0; col < numVertices; col++) {
         cellSpacing = max(adjMatrix[row][col], cellSpacing);
      }
   }
   cellSpacing = max(getNumDigits(numVertices), cellSpacing);
   return cellSpacing;
}

char *getConnectionsString(Graph g, Vertex src) {
   char *connectionString = malloc(sizeof(char) * MAX_CONNECTION_STRING_LEN);
   bool firstConn = true;
   for (Vertex i = 0; i < g -> nV; i++) {
      if (adjacent(g, src, i)) {
         char segment[MAX_SEGMENT_LENGTH];
         if (firstConn) {
            sprintf(segment, "%d", i);
            strcat(connectionString, segment);
            firstConn = false;
         } else {
            sprintf(segment, " - %d", i);
            strcat(connectionString, segment);
         }
      }
   }
   return connectionString;
}
