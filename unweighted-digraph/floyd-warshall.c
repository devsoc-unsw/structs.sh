#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include "Graph.h"
#include "graph-algos.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "../util/colours.h"

void transitiveClosure(Graph g) {
    int tcMatrix[g -> nV][g -> nV]; 
    // First copy over the adjacency matrix values into tcMatrix
    for (int i = 0; i < g -> nV; i++) {
        for (int j = 0; j < g -> nV; j++) {
            tcMatrix[i][j] = g -> edges[i][j];
        }
    }

    // For every vertex i, j, k, if a path i to j exists and if a path j to k 
    // exists, then by transitivity we can say i has a possible path to k
    for (int i = 0; i < g -> nV; i++) {
        for (int j = 0; j < g -> nV; j++) {
            for (int k = 0; k < g -> nV; k++) {
                if (tcMatrix[j][i] && tcMatrix[i][k]) {
                    tcMatrix[j][k] = 1;
                }
            }
        }
    }

    // Showing the transitive closure matrix
    printf("Showing the transitive closure matrix\n");
    printf("\n     ");
    for (Vertex v = 0; v < g -> nV; v++)
        printf("%d ", v);
    printf("\n\n");
    for (Vertex v = 0; v < g -> nV; v++) {
        printf("%-2d ║ ", v);
        for (Vertex w = 0; w < g -> nV; w++) {
            printf("%d ", tcMatrix[v][w]);
        }
        printf("║\n");
    }
}
