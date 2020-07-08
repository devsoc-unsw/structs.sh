#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>
#include "Graph.h"
#include "graph-algos.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "priority-queue/PQueue.h"
#include "../util/colours.h"

// ========== Dijkstra's Algorithm ==========
#define NO_PRED -1
/**
 * Finds the next best candidate edge going out from each included 
 * vertex
 */
Vertex minDistance(Graph g, int *dist, bool *included) {
    // Initialize min value
    int min = INT_MAX, min_index;
    for (int v = 0; v < g -> nV; v++) {
        if (included[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
   return min_index;
}

// A utility function to print the constructed distance array
int printSolution(Graph g, int dist[], int n) {
    printf("Vertex   Distance from Source\n");
    for (int i = 0; i < g -> nV; i++)
        printf("%d \t\t %d\n", i, dist[i]);
}
 
/**
 * Dijkstra's algorithm for determining the single source spanning tree
 * of the input graph from the starting vertex
 */
void dijkstra(Graph g, Vertex src) {
    int V = g -> nV;
    int *dist = malloc(sizeof(int) * g -> nV);  
    bool *included = malloc(sizeof(bool) * g -> nV); 
    int *pred = malloc(sizeof(int) * g -> nV);
 
    // Initialize all distances as INFINITE and stpSet[] as false
    for (int i = 0; i < V; i++) {
        dist[i] = INT_MAX;
        included[i] = false;
        pred[i] = NO_PRED;
    }

    // Distance of source vertex from itself is always 0
    dist[src] = 0;
 
    // Find shortest path for all vertices
    for (int count = 0; count < V-1; count++) {
        // Pick the minimum distance vertex from the set of vertices not
        // yet processed. u is always equal to src in first iteration.
        int u = minDistance(g, dist, included);
        printf("Best neighbour is %d\n", u);
        // Mark the picked vertex as processed
        included[u] = true;
    
        // Update dist value of the adjacent vertices of the picked vertex.
        for (int v = 0; v < V; v++) {
            // Update dist[v] only if is not in included, there is an edge from 
            // u to v, and total weight of path from src to  v through u is 
            // smaller than current value of dist[v]
            if (!included[v] && g -> edges[u][v] && dist[u] != INT_MAX 
                && dist[u]+g -> edges[u][v] < dist[v]) {
                
                pred[v] = u;
                dist[v] = dist[u] + g -> edges[u][v];
            }
        }
    }
    printSolution(g, dist, V);
    for (Vertex v = 0; v < g -> nV; v++) {
        showPathTrace(src, v, pred);
    }
}

/**
 * 
 */
void showPathTrace(Vertex src, Vertex dest, int *pred) {
    while (dest != src) {
        printf("%d <- ", dest);
        dest = pred[dest];
    }
    printf("%d\n", src);
}

// ========== Depth-First Search ==========
/**
 * Recursive depth-first search. This is a wrapper around the 
 * DFSR helper function below.
 */
void DFSRecursive(Graph g, Vertex v) {
    bool *visited = newVisitedArray(g);
    DFSR(g, v, visited);
    free(visited);
}

static void DFSR(Graph g, Vertex currVertex, bool *visited) {
    printf(" ===> Current Vertex: %-2d\n", currVertex);
    visited[currVertex] = true;
    for (Vertex w = 0; w < g -> nV; w++) {
        if (adjacent(g, currVertex, w) && visited[w] == false) 
            DFSR(g, w, visited);
    }
}

/**
 * Iterative depth-first search. Uses a stack
 */
void DFSIterative(Graph g, Vertex v) {
    bool *visited = newVisitedArray(g);
    Stack s = newStack();
    StackPush(s, v);
    while (!StackIsEmpty(s)) {
        Vertex x = StackPop(s);
        if (visited[x] == true) {
            printf(" ===> Already visited %-2d  |\n", x);
            continue;
        }
        printf(" ===> Current Vertex: %-2d", x);
        visited[x] = true;
        for (Vertex y = g -> nV - 1; y >= 0; y--) {
            if (y == -1) 
                break;
            if (!adjacent(g, x, y)) 
                continue;
            if (visited[y] == false)
                StackPush(s, y);
        }
        printf("  |   DFS Stack: ");
        showStack(s);
        printf("                          |   ");
        showVisited(g, visited);
    }
    free(visited);
}


// ========== Depth-First Search ==========
/**
 * Breadth-first search. Uses a queue
 */
void BFS(Graph g, Vertex v) {
    int i; 
    int order = 0;
    bool *visited = newVisitedArray(g);
    Queue q = newQueue();
    QueueJoin(q, v);
    while (!QueueIsEmpty(q)) {
        Vertex x = QueueLeave(q);
        if (visited[x] != false) {
            printf(" ===> Already visited %-2d  |\n", x);
            continue;
        }
        printf(" ===> Current Vertex: %-2d", x);
        visited[x] = true;
        for (Vertex y = 0; y < g -> nV; y++) {
            if (!adjacent(g, x, y)) 
                continue;
            if (visited[y] == false) 
                QueueJoin(q, y);
        }
        printf("  |   BFS Queue: ");
        showQueue(q);
        printf("                          |   ");
        showVisited(g, visited);
    }
    free(visited);
}

/**
 * Given a graph, determines whether it contains a cycle
 */
bool hasCycle(Graph g) {
    bool *visited = newVisitedArray(g);
    // Start checking for cycles starting from 0 (not important where we start from)
    bool cycleExists = dfsFindCycle(g, 0, 0, visited);
    free(visited);
    return cycleExists;
}

static bool dfsFindCycle(Graph g, Vertex curr, Vertex pred, bool *visited) {
    // Mark off the current vertex as visited
    visited[curr] = true;
    for (Vertex neighbour = 0; neighbour < g -> nV; neighbour++) {
        if (adjacent(g, curr, neighbour)) {
            if (!visited[neighbour]) {
                // Keep following a deeper path and see if it leads us to a previously visited node
                return dfsFindCycle(g, neighbour, curr, visited);
            } else if (visited[neighbour] && neighbour != pred) {
                // Reached a previously visited node! (which is NOT the node before) 
                return true;
            }
        }
    }
    return false;
}

/**
 * Given a graph and a start and end vertex, determines if the end vertex
 * is reachable from the start. Ie. does a path exist between start and end? 
 */
bool isReachable(Graph g, Vertex src, Vertex dest) {
    bool *visited = newVisitedArray(g);
    bool result = checkReachable(g, src, dest, visited);
    free(visited);
    return result;
}

static bool checkReachable(Graph g, Vertex src, Vertex dest, bool *visited) {
    if (src == dest) return true;
    visited[src] = true;
    for (Vertex neighbour = 0; neighbour < g -> nV; neighbour++) {
        if (adjacent(g, src, neighbour) && !visited[neighbour]) {
            if (checkReachable(g, neighbour, dest, visited)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Prints each of the connected subgraphs of the given graph
 */
void showConnectedComponents(Graph g) {
    int *vertexIDs = malloc(sizeof(int) * g -> nV);
    for (int i = 0; i < g -> nV; i++) 
        vertexIDs[i] = -1;
    Vertex currVertex = 0;
    for (int componentID = 0; currVertex < g -> nV; componentID++) {
        while(vertexIDs[currVertex] != -1 && currVertex < g -> nV) currVertex++;
        if (currVertex >= g -> nV) break;
        setComponent(g, currVertex, componentID, vertexIDs);
        printf("Component %d: ", componentID);
        for (Vertex v = 0; v < g -> nV; v++)
            if (vertexIDs[v] == componentID) 
                printf("%d ", v);
        printf("\n");
    }
}

static void setComponent(Graph g, Vertex curr, int id, int *vertexIDs) {
    vertexIDs[curr] = id;
    for (Vertex neighbour = 0; neighbour < g -> nV; neighbour++) {
        if (adjacent(g, curr, neighbour)) {
            // If the neighbour has not been assigned a component ID, call setComponents on them
            if (vertexIDs[neighbour] == -1) {
                setComponent(g, neighbour, id, vertexIDs);
            }
        }
    } 
}

/**
 * Returns true if there exists a Hamiltonian path between the
 * src and dest vertex in the given graph 
 */
bool hasHamiltonPath(Graph g, Vertex src, Vertex dest) {
    bool *visited = newVisitedArray(g);
    bool res = hamiltonPathCheck(g, src, dest, g -> nV - 1, visited);
    free(visited);
    return res;
}

static bool hamiltonPathCheck(Graph g, Vertex v, Vertex w, int d, bool *visited) {
    if (v == w) return (d == 0) ? true : false;
    visited[v] = true;
    for (int t = 0; t < g -> nV; t++) {
        if (adjacent(g, v, t) && visited[t] == false) {
            if (hamiltonPathCheck(g, t, w, d - 1, visited)) return true;
        }
    }
    visited[v] = false;
    return false;
}

// ===== Other Helper Functions =====
/**
 * Returns a boolean array that keeps track of whether or not
 * the vertex at the corresponding index has been visited 
 */ 
static bool *newVisitedArray(Graph g) {
    bool *visited = malloc(sizeof(bool) * g -> nV); 
    for (int i = 0; i < g -> nV; i++)
        visited[i] = false;
    return visited;
}

/**
 * Given a graph and the visited array, prints the nodes
 * that have been visited
 */ 
static void showVisited(Graph g, bool *visited) {
    printf("Visited  :");
    for (Vertex i = 0; i < g -> nV; i++) {
        if (visited[i]) {
            printf(" %d", i);
        }
    }
    printf("\n");
}
