#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>
#include "Graph.h"
#include "graph-algos.h"
#include "dijkstra.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "priority-queue/PQueue.h"
#include "../util/colours.h"
#define NO_PRED -1

// ========== Dijkstra's Algorithm ==========
/**
 * Dijkstra's algorithm for determining the single source spanning tree
 * of the input graph from the starting vertex
 * 
 * High-level steps:
 *   1. Look at every neighbour of the vertices we currently have in vSet
 *   2. Find the neighbour vertex with the lowest cost to get to and 
 *      include it in our set of vertices
 *   3. Look at all the unincluded neighbours of the new vertex, and
 *      update the dist array if we've found a BETTER path to those neighbours
 *   4. Repeat 1-3 until all vertices have been included in vSet
 */
void dijkstra(Graph g, Vertex src) {
    bool vSet[g -> nV]; 
    int dist[g -> nV];  
    int pred[g -> nV];
    // Initialising all 3 arrays
    for (int i = 0; i < g -> nV; i++) {
        dist[i] = INT_MAX;
        vSet[i] = false;
        pred[i] = NO_PRED;   // NO_PRED is #defined as -1
    }
    // The distance to itself is 0
    dist[src] = 0;
 
    for (int count = 0; count < g -> nV - 1; count++) {
        // Pick the minimum distance vertex from the set of vertices not yet processed
        int u = getLowestCostVertex(g, dist, vSet);
        // Mark the chosen vertex as included
        vSet[u] = true;
        for (int v = 0; v < g -> nV; v++) {
            // Look at all the unincluded neighbours of the newly included vertex 
            if (!vSet[v] && adjacent(g, u, v)) {
                // Update dist[v] if the total weight of the path, dist[u] + weight of u-v, 
                // is smaller than value of dist[v] we currently have
                if (dist[u] != INT_MAX && dist[u]+g -> edges[u][v] < dist[v]) {
                    dist[v] = dist[u] + g -> edges[u][v];
                    pred[v] = u;
                }
            }
        }
    }

    showShortestPaths(g, src, dist, pred);
}

/**
 * Finds the next best candidate edge going out from each vSet 
 * vertex
 */
Vertex getLowestCostVertex(Graph g, int *dist, bool *vSet) {
    // Initialize min value
    int min = INT_MAX, min_index;
    for (int v = 0; v < g -> nV; v++) {
        if (vSet[v] == false && dist[v] <= min) {
            min = dist[v];
            min_index = v;
        }
    }
   return min_index;
}
 
/**
 * Given a source vertex, destination vertex and the predecessors of
 * each vertex, trace a path from destination to source
 */
void showPathTrace(Vertex src, Vertex dest, int *pred) {
    Stack path = newStack();
    while (dest != src) {
        stackPush(path, dest);
        dest = pred[dest];
    }
    printf("%d", src);
    while (!stackIsEmpty(path)) {
        printf(" ⮕ %d", stackPop(path));
    }
    printf("\n");
}

/**
 * Shows all the shortest paths from a source vertex to every other
 * vertex in the supplied graph
 */
int showShortestPaths(Graph g, int src, int *dist, int *pred) {
    for (Vertex v = 0; v < g -> nV; v++) {
        printf("Shortest distance to %d is %d\n", v, dist[v]);
        printf("    Path: ");
        showPathTrace(src, v, pred);
    }
}
