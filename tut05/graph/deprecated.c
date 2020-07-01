


// DFS cycle checker
int dfsCycleCheck(Graph g, Vertex v, Vertex prev) {
   printf("v=%d vis: ", v); showVisited(g);
   visited[v] = 1;
   Vertex w;
   for (w = 0; w < g -> nV; w++) {
      if (adjacent(g, v, w)) {
         printf("edge %d-%d\n", v, w);
         if (!visited[w])
            return dfsCycleCheck(g, w, v);
         else if (w != prev) 
            return 1; // found cycle
      }
   }
   return 0; // no cycle at v
}

int hasCycle(Graph g) {
   visited = calloc(g -> nV, sizeof(int));
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
   for (Vertex w = 0; w < g -> nV; w++) {
      if (adjacent(g, v, w) && componentOf[w] == -1)
         dfsComponents(g, w, c);
   }
}

void components(Graph g) {
   int compID = 0; 
   componentOf = malloc(g -> nV*sizeof(int));
   for (int i = 0; i < g -> nV; i++) componentOf[i] = -1;
   ncounted = 0;
   while (ncounted < g -> nV) {
      Vertex v;
      for (v = 0; v < g -> nV; v++)
         if (componentOf[v] == -1) break;
      dfsComponents(g, v, compID);
      compID++;
   }
   // componentOf[] is now set
   for (int i = 0; i < compID; i++) {
      printf("Component %d has", i);
      for (int j = 0; j < g -> nV; j++) {
         if (componentOf[j] == i) printf(" %d", j);
      }
      printf("\n");
   }
}


// DFS path checker
int dfsPathCheck(Graph g, Vertex v, Vertex dest) {
   visited[v] = 1;
   Vertex w;
   for (w = 0; w < g -> nV; w++) {
      if (!adjacent(g, v, w)) continue;
      if (w == dest) return 1; // found path
      if (!visited[w]) {
         if (dfsPathCheck(g, w, dest)) return 1;
      }
   }
   return 0; // no path from v to dest
}

int dfsHasPath(Graph g, Vertex src, Vertex dest) {
   visited = calloc(g -> nV, sizeof(int));
   int result = dfsPathCheck(g, src, dest);
   free(visited);
   return result;
}



// DFS path finder
int *path;  // array [0..V-1] of Vertex
            // path[i] holds i'th vertex visited

int dfsPathFind(Graph g, Vertex v, Vertex dest, int ord) {
    printf("pf(g, %d, %d, %d)\n", v, dest, ord);
    visited[v] = 1;
    path[ord] = v;
    if (v == dest) return 1;
    for (Vertex w = 0; w < g -> nV; w++) {
        if (!adjacent(g, v, w)) continue;
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
    visited = calloc(g -> nV, sizeof(int));
    path = malloc((g -> nV+1)*sizeof(Vertex));
    for (i = 0; i <= g -> nV; i++) path[i] = -1;
    if (!dfsPathFind(g, src, dest, 0))
        printf("No path from %d to %d\n", src, dest);
    else {
        printf("Path: %d", path[0]);
        for (i = 1; path[i] != -1; i++)
            printf(" -> %d", path[i]);
        printf("\n");
    }
    free(visited); free(path);
}


//BFS traversal with re-ordered visited array
void bfsShow(Graph g, Vertex v) {
    bfs(g, v);
    // set visited with required order
    int *tmp = malloc(g -> nV * sizeof(int));
    int i, ord;
    for (i = 0; i < g -> nV; i++) tmp[i] = -1;
    for (ord = 0; ord < order; ord++) {
        for (v = 0; v < g -> nV; v++) {
            if (visited[v] == ord) break;
        }
        tmp[ord] = v;
    }
    for (i = 0; i < g -> nV; i++) {
        visited[i] = tmp[i];
    }
    free(tmp);
    printf("%d", visited[0]);
    for (i = 1; i < g -> nV; i++) {
        if (visited[i] == -1) break;
        printf("-%d", visited[i]);
    }
    printf("\n");
}


// BFS path checker

int hasPath(Graph g, Vertex src, Vertex dest) {
   visited = calloc(g -> nV, sizeof(int));
   Queue q = newQueue();
   QueueJoin(q, src); 
   int isFound = 0;
   while (!QueueIsEmpty(q) && !isFound) {
      Vertex y, x = QueueLeave(q);
      if (visited[x]) continue;
      visited[x] = 1;
      for (y = 0; y < g -> nV; y++) {
         if (!adjacent(g, x, y)) continue;
         if (y == dest) { isFound = 1; break; }
         if (!visited[y]) { QueueJoin(q, y); }
      }
   }
   free(visited);
   return isFound;
}


// iterative BFS algorithm to print path src...dest
void findPath(Graph g, Vertex src, Vertex dest) {
   visited = calloc(g -> nV, sizeof(int));
   Vertex *path = calloc(g -> nV, sizeof(Vertex));
   Queue q = newQueue();
   QueueJoin(q, src);
   int isFound = 0;
   while (!QueueIsEmpty(q) && !isFound) {
      Vertex y, x = QueueLeave(q);
      if (visited[x]) continue;
      visited[x] = 1;
      printf("x=%d, q=", x);
      for (y = 0; y < g -> nV; y++) {
         if (!adjacent(g, x, y) || visited[y]) continue;
         path[y] = x;
         if (y == dest) { isFound = 1; break; }
         if (!visited[y]) QueueJoin(q, y);
      }
      showQueue(q);
   }
   if (!isFound)
      printf("No path from %d to %d\n", src, dest);
   else {
      // display path in dest..src order
      Vertex v;
      printf("Path: ");
      for (v = dest; v != src; v = path[v])
          printf("%d<-", v);
      printf("%d\n", src);
   }
}



