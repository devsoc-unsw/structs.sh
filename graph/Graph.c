#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include <stdbool.h>
#include "Graph.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "../util/colours.h"

// graph representation (adjacency matrix)
typedef struct GraphRep {
   int   nV;    // #vertices
   int   nE;    // #edges
   int **edges; // matrix of 0/1
} GraphRep;

// check validity of Vertex
int validV(Graph g, Vertex v) {
   return (g != NULL && v >= 0 && v < g->nV);
}

// create an Edge value
Edge mkEdge(Graph g, Vertex v, Vertex w) {
   assert(validV(g,v) && validV(g,w));
   Edge e = {v,w}; // struct assignment
   // or  Edge e; e.v = v; e.w = w;
   return e;
}

// are two vertices directly connected?
bool adjacent(Graph g, Vertex v, Vertex w) {
   assert(validV(g,v) && validV(g,w));
    return (g->edges[v][w] != 0);
}

// create an empty graph
Graph newGraph(int nV) {
   assert(nV > 0);
   int **e = malloc(nV * sizeof(int *));
   assert(e != NULL);
   for (int i = 0; i < nV; i++) {
#if 1
      e[i] = calloc(nV, sizeof(int));
      assert(e[i] != NULL);
#else
      e[i] = malloc(nV * sizeof(int));
      assert(e[i] != NULL);
      for (int j = 0; j < nV; j++)
         e[i][j] = 0;
#endif
   }
   Graph g = malloc(sizeof(GraphRep));
   assert(g != NULL);
   g->nV = nV;  g->nE = 0;  g->edges = e;
   return g;
}

// create a random graph
Graph newRandomGraph(int nV) {
   Graph g = newGraph(nV);
   for (int v = 0; v < nV; v++) {
      for (int w = v+1; w < nV; w++) {
         if (rand()%4 == 0)
            insertE(g, mkEdge(g,v,w));
      }
   }
   return g;
}

// add a new edge
void  insertE(Graph g, Edge e) {
   assert(g != NULL);
   assert(validV(g,e.v) && validV(g,e.w));
   if (g->edges[e.v][e.w]) return;
   g->edges[e.v][e.w] = 1;
   g->edges[e.w][e.v] = 1;
   g->nE++;
}

// delete an edge
void  removeE(Graph g, Edge e) {
   assert(g != NULL);
   assert(validV(g,e.v) && validV(g,e.w));
   if (!g->edges[e.v][e.w]) return;
   g->edges[e.v][e.w] = 0;
   g->edges[e.w][e.v] = 0;
   g->nE--;
}

// returns #edges & array of edges
int edges(Graph g, Edge *es, int nE) {
   int n = 0; // how many edges added to es[]
   for (int i = 0; i < g->nV; i++) {
      for (int j = i+1; j < g->nV; j++) {
         if (n == nE) return n;
         if (adjacent(g,i,j)) {
            es[n++] = mkEdge(g,i,j);
         }
      }
   }

   return 0;
}

// free memory associated with graph
void dropGraph(Graph g) {
   assert(g != NULL);
   for (int i = 0; i < g->nV; i++)
      free(g->edges[i]);
   free(g->edges);
   free(g);
}

// display a graph
void show(Graph g, int option) {
   assert(g != NULL);
   int v, w;
   switch (option) {
      case ADJACENCY_LIST:
         printf("Showing the adjacency list\n");
         printf("|—————————————————————————|\n");
         printPrimary(" Vertex   Connections\n");
         printf("|—————————————————————————|\n");
         for (v = 0; v < g->nV; v++) {
            printf("  %-3d   ║",v);
            
            for (w = 0; w < g->nV; w++) {
               if (adjacent(g,v,w)) printf(" ⟶ %d",w);
            }
            printf("\n");
         }
         break;
      case ADJACENCY_MATRIX:
         printf("Showing the adjacency matrix\n");
         printf("\n     ");
         for (v = 0; v < g->nV; v++)
            printf("%d ", v);
         printf("\n\n");
         for (v = 0; v < g->nV; v++) {
            printf("%-2d ║ ", v);
            for (w = 0; w < g->nV; w++) {
               if (adjacent(g,v,w)) printf("1 ");
               else printf("0 ");
            }
            printf("║\n");
         }
         break;
   }
   printf("\nSummary: the graph has %d vertices and %d edges\n",g->nV,g->nE);
}

// Additions

int  order;   // counter used by various algorithms
int *visited; // array use by various algorithms

void showVisited(Graph g) {
   int i;
   for (i = 0; i < g->nV; i++)
      printf("[%d]=%d ",i,visited[i]);
   putchar('\n');
}


// DFS traversal


// Recursive version
// Handles one connected component
void dfsR(Graph g, Vertex v) {
   printf("%d\n",v);
   visited[v] = order++;
   Vertex w;
   for (w = 0; w < g->nV; w++) {
      if (adjacent(g,v,w) && visited[w] == -1) 
         dfsR(g, w);
   }
}

// Handles multiple connected components
void dfsRecursive(Graph g, Vertex whoCares) {
   int i;
   visited = malloc(g->nV * sizeof(int));
   for (i = 0; i < g->nV; i++) visited[i] = -1;
   order = 0;
   while (order < g->nV) {
      Vertex v;
      for (v = 0; v < g->nV; v++)
         if (visited[v] == -1) break;
      dfsRecursive(g, v);
   }
// showVisited(g);
}

// Iterative (stack-based) version
// Handles one connected component
void dfs(Graph g, Vertex v) {
   int i, order = 0;
   visited = malloc(g->nV * sizeof(int));
   for (i = 0; i < g->nV; i++) visited[i] = -1;
   Stack s = newStack();
   StackPush(s,v);
   while (!StackIsEmpty(s)) {
      Vertex y, x = StackPop(s);
      if (visited[x] != -1) continue;
      printf((g->nV < 15)?"x=%-2d":"%d ",x);
      visited[x] = order++;
      for (y = g->nV-1; y >= 0; y--) {
         if (!adjacent(g,x,y)) continue;
         if (visited[y] == -1) StackPush(s,y);
      }
      if (g->nV < 15) {printf("  s=");showStack(s);}
   }
}

// DFS cycle checker
int dfsCycleCheck(Graph g, Vertex v, Vertex prev) {
   printf("v=%d vis: ",v); showVisited(g);
   visited[v] = 1;
   Vertex w;
   for (w = 0; w < g->nV; w++) {
      if (adjacent(g,v,w)) {
         printf("edge %d-%d\n",v,w);
         if (!visited[w])
            return dfsCycleCheck(g, w, v);
         else if (w != prev) 
            return 1; // found cycle
      }
   }
   return 0; // no cycle at v
}

int hasCycle(Graph g) {
   visited = calloc(g->nV,sizeof(int));
   int result = dfsCycleCheck(g, 0, 0);
   free(visited);
   return result;
}


// DFS connected components
int ncounted;
int *componentOf;  // array of component ids
                   // indexed by vertex 0..V-1

void dfsComponents(Graph g, Vertex v, int c) {
   componentOf[v] = c;
   ncounted++;
   for (Vertex w = 0; w < g->nV; w++) {
      if (adjacent(g,v,w) && componentOf[w] == -1)
         dfsComponents(g, w, c);
   }
}

void components(Graph g) {
   int compID = 0; 
   componentOf = malloc(g->nV*sizeof(int));
   for (int i = 0; i < g->nV; i++) componentOf[i] = -1;
   ncounted = 0;
   while (ncounted < g->nV) {
      Vertex v;
      for (v = 0; v < g->nV; v++)
         if (componentOf[v] == -1) break;
      dfsComponents(g, v, compID);
      compID++;
   }
   // componentOf[] is now set
   for (int i = 0; i < compID; i++) {
      printf("Component %d has",i);
      for (int j = 0; j < g->nV; j++) {
         if (componentOf[j] == i) printf(" %d",j);
      }
      printf("\n");
   }
}


// DFS path checker
int dfsPathCheck(Graph g, Vertex v, Vertex dest) {
   visited[v] = 1;
   Vertex w;
   for (w = 0; w < g->nV; w++) {
      if (!adjacent(g,v,w)) continue;
      if (w == dest) return 1; // found path
      if (!visited[w]) {
         if (dfsPathCheck(g, w, dest)) return 1;
      }
   }
   return 0; // no path from v to dest
}

int dfsHasPath(Graph g, Vertex src, Vertex dest) {
   visited = calloc(g->nV,sizeof(int));
   int result = dfsPathCheck(g, src, dest);
   free(visited);
   return result;
}



// DFS path finder
int *path;  // array [0..V-1] of Vertex
            // path[i] holds i'th vertex visited

int dfsPathFind(Graph g, Vertex v, Vertex dest, int ord) {
   printf("pf(g,%d,%d,%d)\n",v,dest,ord);
   visited[v] = 1;
   path[ord] = v;
   if (v == dest) return 1;
   for (Vertex w = 0; w < g->nV; w++) {
      if (!adjacent(g,v,w)) continue;
      if (!visited[w]) {
         if (dfsPathFind(g, w, dest, ord+1))
            return 1;
         else
            path[ord+1] = -1;
      }
   }
   return 0;
}

void dfsFindPath(Graph g, Vertex src, Vertex dest) {
   int i;
   visited = calloc(g->nV, sizeof(int));
   path = malloc((g->nV+1)*sizeof(Vertex));
   for (i = 0; i <= g->nV; i++) path[i] = -1;
   if (!dfsPathFind(g,src,dest,0))
      printf("No path from %d to %d\n",src,dest);
   else {
      printf("Path: %d",path[0]);
//      for (i = 1; path[i] != dest; i++)
      for (i = 1; path[i] != -1; i++)
         printf("->%d",path[i]);
      printf("\n");
   }
   free(visited); free(path);
}

// BFS traversal
void bfs(Graph g, Vertex v) {
   int i; order = 0;
   visited = malloc(g->nV * sizeof(int));
   for (i = 0; i < g->nV; i++) visited[i] = -1;
   Queue q = newQueue();
   QueueJoin(q,v);
   while (!QueueIsEmpty(q)) {
      Vertex y, x = QueueLeave(q);
      if (visited[x] != -1) continue;
      printf("x=%-2d",x);
//    visited[order++] = x;
      visited[x] = order++;
      for (y = 0; y < g->nV; y++) {
         if (!adjacent(g,x,y)) continue;
         if (visited[y] == -1) QueueJoin(q,y);
      }
      printf("  q=");showQueue(q);
   }
}




//BFS traversal with re-ordered visited array
void bfsShow(Graph g, Vertex v) {
   bfs(g,v);
   // set visited with required order
   int *tmp = malloc(g->nV * sizeof(int));
   int i, ord;
   for (i = 0; i < g->nV; i++) tmp[i] = -1;
   for (ord = 0; ord < order; ord++) {
      for (v = 0; v < g->nV; v++) {
         if (visited[v] == ord) break;
      }
      tmp[ord] = v;
   }
   for (i = 0; i < g->nV; i++) {
      visited[i] = tmp[i];
   }
   free(tmp);
   printf("%d",visited[0]);
   for (i = 1; i < g->nV; i++) {
      if (visited[i] == -1) break;
      printf("-%d",visited[i]);
   }
   printf("\n");
}




// BFS path checker

int hasPath(Graph g, Vertex src, Vertex dest) {
   visited = calloc(g->nV,sizeof(int));
   Queue q = newQueue();
   QueueJoin(q,src); 
   int isFound = 0;
   while (!QueueIsEmpty(q) && !isFound) {
      Vertex y, x = QueueLeave(q);
      if (visited[x]) continue;
//    printf("x=%d  vis: ",x); showVisited(g);
      visited[x] = 1;
      for (y = 0; y < g->nV; y++) {
         if (!adjacent(g,x,y)) continue;
         if (y == dest) { isFound = 1; break; }
         if (!visited[y]) { QueueJoin(q,y); }
      }
   }
   free(visited);
   return isFound;
}


// iterative BFS algorithm to print path src...dest
void findPath(Graph g, Vertex src, Vertex dest) {
   visited = calloc(g->nV,sizeof(int));
   Vertex *path = calloc(g->nV,sizeof(Vertex));
   Queue q = newQueue();
   QueueJoin(q,src);
   int isFound = 0;
   while (!QueueIsEmpty(q) && !isFound) {
      Vertex y, x = QueueLeave(q);
      if (visited[x]) continue;
      visited[x] = 1;
      printf("x=%d, q=",x);
      for (y = 0; y < g->nV; y++) {
         if (!adjacent(g,x,y) || visited[y]) continue;
         path[y] = x;
         if (y == dest) { isFound = 1; break; }
         if (!visited[y]) QueueJoin(q,y);
      }
      showQueue(q);
   }
   if (!isFound)
      printf("No path from %d to %d\n",src,dest);
   else {
      // display path in dest..src order
      Vertex v;
      printf("Path: ");
      for (v = dest; v != src; v = path[v])
          printf("%d<-", v);
      printf("%d\n", src);
   }
}




// check for Hamilton path

// visited [0..V-1] of bools

int HamiltonR(Graph g, Vertex v, Vertex w, int d) {
   int t; 
   if (v == w) return (d == 0) ? 1 : 0;
   visited[v] = 1;
   for (t = 0; t < g->nV; t++) {
      if (!adjacent(g,v,t)) continue;
      if (visited[v] == 1) continue;
      if (HamiltonR(g,t,w,d-1)) return 1;
   }
   visited[v] = 0;
   return 0;
}

int hasHamiltonPath(Graph g, Vertex src, Vertex dest) {
   visited = calloc(g->nV,sizeof(int));
   int res = HamiltonR(g, src, dest, g->nV-1);
   free(visited);
   return res;
}
