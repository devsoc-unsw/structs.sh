#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include <string.h>
#include "graph.h"
#include "graph-algos.h"
#include "../graph-helpers/queue/Queue.h"
#include "../graph-helpers/stack/Stack.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"

#define MAX_VERTICES              50
#define MAX_SEGMENT_LENGTH        12
#define MAX_CONNECTION_STRING_LEN MAX_VERTICES * MAX_SEGMENT_LENGTH

#define max(a, b) (a > b) ? a : b

int validV(Graph g, Vertex v) {
   return g != NULL && v >= 0 && v < g -> nV;
}

Edge makeEdge(Graph g, Vertex v, Vertex w) {
   Edge e; 
   e.v = v; 
   e.w = w;
   return e;
}

Edge getEdge(Graph g, Vertex v, Vertex w) {
   return makeEdge(g, v, w);
}

bool edgeIsValid(Graph g, Edge e) {
   if (!(validV(g, e.v) && validV(g, e.w))) {
      printColoured("red", "Invalid edge: %d - %d\n", e.v, e.w);
      return false;
   }
   return true;
}

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

Graph newRandomGraph(int nV, int densityFactor) {
   Graph g = newGraph(nV);
   double spawnProbability = densityFactor / 100.0;
   for (int v = 0; v < nV; v++) {
      for (int w = v + 1; w < nV; w++) {
         // Generate a floating point in range 0 to 1
         double randomVal = (double) rand() / RAND_MAX;
         if (randomVal <= spawnProbability && !adjacent(g, v, w)) 
            insertEdge(g, makeEdge(g, v, w));
         // Reroll to add bidirectional edge
         randomVal = (double) rand() / RAND_MAX;
         if (randomVal <= spawnProbability && !adjacent(g, w, v)) 
            insertEdge(g, makeEdge(g, w, v));
      }
   }
   return g;
}

bool adjacent(Graph g, Vertex v, Vertex w) {
   if (validV(g, v) && validV(g, w)) {
      return (g -> edges[v][w] != 0);
   } else {
      return false;
   }
}

void insertEdge(Graph g, Edge e) {
   assert(g != NULL);
   if (!edgeIsValid(g, e)) return;
   if (g -> edges[e.v][e.w]) {
      printColoured("red", "Edge already exists: %d - %d\n", e.v, e.w);
      return;
   }
   g -> edges[e.v][e.w] = 1;
   g -> nE++;
}

Edge removeEdge(Graph g, Edge e) {
   assert(g != NULL);
   if (!edgeIsValid(g, e)) return e;
   if (!(g -> edges[e.v][e.w])) {
      printColoured("red", "Edge doesn't exist: %d - %d\n", e.v, e.w);
      return e;
   }
   int oldWeight = g -> edges[e.v][e.w];
   g -> edges[e.v][e.w] = 0;
   g -> nE--;
   return e;
}

int degreeOut(Graph g, Vertex src) {
   int degree = 0;
   for (Vertex v = 0; v < g -> nV; v++) {
      if (adjacent(g, src, v)) {
         degree++;
      }
   }
   return degree;
}

int degreeIn(Graph g, Vertex src) {
   int degree = 0;
   for (Vertex v = 0; v < g -> nV; v++) {
      if (adjacent(g, v, src)) {
         degree++;
      }
   }
   return degree;
}

int degree(Graph g, Vertex v) {
   return degreeIn(g, v) + degreeOut(g, v);
}

int showDegree(Graph g, Vertex v) {
   int in = degreeIn(g, v), out = degreeOut(g, v);
   printf(" ➤ In degree:    %d\n", in);
   printf(" ➤ Out degree:   %d\n", out);
   printf(" ➤ Total degree: %d\n", in + out);
   return in + out;
}

void dropGraph(Graph g) {
   assert(g != NULL);
   for (int i = 0; i < g -> nV; i++)
      free(g -> edges[i]);
   free(g -> edges);
   free(g);
}

void showGraph(Graph g, int option) {
   assert(g != NULL);
   switch (option) {
      case ADJACENCY_LIST:
         printHeader("Adjacency List");
         showAdjacencyList(g);
         break;
      case ADJACENCY_MATRIX:
         printHeader("Adjacency Matrix");
         showAdjacencyMatrix(g);
         break;
   }
   printf("\nSummary: the graph has %d vertices and %d edges\n", g -> nV, g -> nE);
   printHorizontalRule();
}

static void showAdjacencyMatrix(Graph g) {
   int cellSpacing = getCellSpacing(g -> nV, g -> edges);
   int horizontalBorderWidth = (cellSpacing + 1) * (g -> nV) + 1;
   if (horizontalBorderWidth + 3 >= getTermWidth()) {   // Note: the +3 comes from the left column of row numbers
      printColoured("red", "The matrix is too large to be printed here. Try resizing the window\n");
      return;
   }
   printf("\n     ");
   // Printing upper row of column numbers
   for (Vertex v = 0; v < g -> nV; v++) printColoured("yellow", "%-*d ", cellSpacing, v);
   printf("\n");
   // Printing upper matrix border
   printf("   %s", BOX_EDGE_CHAR_TOP_LEFT);
   for (Vertex v = 0; v < (cellSpacing + 1) * (g -> nV) + 1; v++) printf("%s", BOX_EDGE_CHAR_HORIZONTAL);
   printf("%s\n", BOX_EDGE_CHAR_TOP_RIGHT);
   for (Vertex v = 0; v < g -> nV; v++) {
      printColoured("yellow", "%-2d ", v);
      printf("%s ", BOX_EDGE_CHAR_VERTICAL);
      for (Vertex w = 0; w < g -> nV; w++) {
         if (adjacent(g, v, w)) printColoured("green", "%-*d ", cellSpacing, 1);
         else printColoured("purple", "%-*d ", cellSpacing, 0);
      }
      printf("%s\n", BOX_EDGE_CHAR_VERTICAL);
   }
   // Printing lower matrix border
   printf("   %s", BOX_EDGE_CHAR_BOTTOM_LEFT);
   for (Vertex v = 0; v < (cellSpacing + 1) * (g -> nV) + 1; v++) printf("%s", BOX_EDGE_CHAR_HORIZONTAL);
   printf("%s\n", BOX_EDGE_CHAR_BOTTOM_RIGHT);
}

static void showAdjacencyList(Graph g) {
   printColoured("yellow", " Vertex   Connections\n");
   printHorizontalRule();
   for (Vertex v = 0; v < g -> nV; v++) {
      printf("    %3d %s", v, BOX_EDGE_CHAR_VERTICAL);
      char *connections = getConnectionsString(g, v);
      if (strlen(connections) + 8 >= getTermWidth()) {   // Note: the +8 comes from the width of the left column of vertices 
         printColoured("red", "Too many to print\n");
         continue;
      }
      printf("%s\n", connections);
      free(connections);
   }
}

int getCellSpacing(int numVertices, int **adjMatrix) {
   int cellSpacing = 0;
   for (int row = 0; row < numVertices; row++) {
      for (int col = 0; col < numVertices; col++) {
         cellSpacing = max(getNumDigits(adjMatrix[row][col]), cellSpacing);
      }
   }
   cellSpacing = max(getNumDigits(numVertices), cellSpacing);
   return cellSpacing;
}

char *getConnectionsString(Graph g, Vertex src) {
   char *connectionString = malloc(sizeof(char) * MAX_CONNECTION_STRING_LEN);
   strcpy(connectionString, "");
   bool firstConn = true;
   for (Vertex i = 0; i < g -> nV; i++) {
      if (adjacent(g, src, i)) {
         char segment[MAX_SEGMENT_LENGTH];
         if (firstConn) {
            sprintf(segment, " %d", i);
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
