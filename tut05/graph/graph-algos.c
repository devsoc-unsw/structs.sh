#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include "Graph.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "../util/colours.h"

static void DFSR(Graph g, Vertex currVertex, bool *visited);

static bool *newVisitedArray(Graph g) {
    bool *visited = malloc(sizeof(bool) * g -> nV); 
    for (int i = 0; i < g -> nV; i++)
        visited[i] = false;
    return visited;
}

static void showVisited(Graph g, bool *visited) {
    printf("Visited  :");
    for (Vertex i = 0; i < g -> nV; i++) {
        if (visited[i]) {
            printf(" %d", i);
        }
    }
    printf("\n");
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
void bfs(Graph g, Vertex v) {
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


// check for Hamilton path
// visited [0..V-1] of bools

// int HamiltonR(Graph g, Vertex v, Vertex w, int d) {
//    int t; 
//    if (v == w) return (d == 0) ? 1 : 0;
//    visited[v] = 1;
//    for (t = 0; t < g -> nV; t++) {
//       if (!adjacent(g, v, t)) continue;
//       if (visited[v] == 1) continue;
//       if (HamiltonR(g, t, w, d-1)) return 1;
//    }
//    visited[v] = 0;
//    return 0;
// }

// int hasHamiltonPath(Graph g, Vertex src, Vertex dest) {
//    visited = calloc(g -> nV, sizeof(int));
//    int res = HamiltonR(g, src, dest, g -> nV-1);
//    free(visited);
//    return res;
// }


