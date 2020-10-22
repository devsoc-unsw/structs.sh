#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include "graph.h"
#include "graph-algos.h"
#include "queue/Queue.h"
#include "stack/Stack.h"
#include "linked-list/List.h"
#include "../util/display/display.h"

// ========== Depth-First Search ==========
/**
 * Recursive depth-first search. This is a wrapper around the 
 * DFSR helper function below.
 */
void dfs(Graph g, Vertex v) {
    showTraversalTrace(g, v);
    printf("Traversal order (from top to bottom in the above stacktrace):\n");
    bool *visited = newVisitedArray(g);
    dfsRecursive(g, v, visited);
    printf("\n");
    free(visited);
}

static void dfsRecursive(Graph g, Vertex currVertex, bool *visited) {
    printf("%-2d ", currVertex);
    visited[currVertex] = true;
    for (Vertex w = 0; w < g -> nV; w++) {
        if (adjacent(g, currVertex, w) && visited[w] == false) {
            printf("→ ");
            dfsRecursive(g, w, visited);
        }
    }
}

// ========== Breadth-First Search ==========
/**
 * Breadth-first search. Uses a queue
 */
void bfs(Graph g, Vertex v) {
    showTraversalTrace(g, v);
    printf("Traversal order (from left to right, layer by layer in the above stacktrace):\n");
    bool *visited = newVisitedArray(g);
    Queue q = newQueue();
    QueueJoin(q, v);
    while (!QueueIsEmpty(q)) {
        Vertex x = QueueLeave(q);
        if (visited[x] != false) continue;
        if (x != v) printf(" → ");
        printf("%-2d", x);
        visited[x] = true;
        for (Vertex y = 0; y < g -> nV; y++) {
            if (!adjacent(g, x, y)) continue;
            if (visited[y] == false) QueueJoin(q, y);
        }
    }
    printf("\n");
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

void transitiveClosure(Graph g) {
    int tcMatrix[g -> nV][g -> nV]; 
    // First copy over the adjacency matrix values into tcMatrix
    for (int i = 0; i < g -> nV; i++) {
        for (int j = 0; j < g -> nV; j++) {
            tcMatrix[i][j] = g -> edges[i][j];
        }
    }

    // For every vertex i, j, k, if a path j to i exists and if a path i to k 
    // exists, then by transitivity we can say j has a possible path to k
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
            if (tcMatrix[v][w]) printColoured("green", "%-*d ", cellSpacing, 1);
            else printColoured("purple", "%-*d ", cellSpacing, 0);
        }
        printf("%s\n", BOX_EDGE_CHAR_VERTICAL);
    }
    // Printing lower matrix border
    printf("   %s", BOX_EDGE_CHAR_BOTTOM_LEFT);
    for (Vertex v = 0; v < (cellSpacing + 1) * (g -> nV) + 1; v++) printf("%s", BOX_EDGE_CHAR_HORIZONTAL);
    printf("%s\n", BOX_EDGE_CHAR_BOTTOM_RIGHT);
}

// ===== Other Helper Functions =====
/**
 * Returns a boolean array that keeps track of whether or not
 * the vertex at the corresponding index has been visited 
 */ 
bool *newVisitedArray(Graph g) {
    bool *visited = malloc(sizeof(bool) * g -> nV); 
    for (int i = 0; i < g -> nV; i++)
        visited[i] = false;
    return visited;
}

/**
 * Returns a Vertex array that keeps track of each vertex's predecessor
 * in a path
 */ 
Vertex *newPredArray(Graph g) {
    Vertex *pred = malloc(sizeof(Vertex) * g -> nV); 
    for (int i = 0; i < g -> nV; i++)
        pred[i] = -1;
    return pred;
}

/**
 * Given a graph and the visited array, prints the nodes
 * that have been visited
 */ 
void showVisited(Graph g, bool *visited) {
    printf("Visited  :");
    for (Vertex i = 0; i < g -> nV; i++) {
        if (visited[i]) {
            printf(" %d", i);
        }
    }
    printf("\n");
}

/**
 * Given a graph and the visited array, prints the nodes
 * that have been visited
 */ 
void tracePred(Vertex *pred, Vertex dest) {
    printf("Pred  :");
    int i = dest;
    printf("%d", i);
    while (pred[i] != -1) {
        printf(" <- %d", pred[i]);
        i = pred[i];
    }
    printf("Done\n");
}

// ===== Traversal Tracer =====

void showTraversalTrace(Graph g, Vertex startingVertex) {
    printHeader("Paths from %d", startingVertex);
    bool *levelConnector = malloc(sizeof(int) * g -> nV);
    bool *visited = newVisitedArray(g);
    for (int i = 0; i < g -> nV; i++) levelConnector[i] = false;
    traversalTracer(g, startingVertex, visited, 0, levelConnector);
    free(visited);
}

static void markVisited(Graph g, Vertex startVertex, bool *visited) {
    for (Vertex neighbour = 0; neighbour < g -> nV; neighbour++) {
        if (adjacent(g, startVertex, neighbour) && !visited[neighbour]) {
            visited[neighbour] = true;
            markVisited(g, neighbour, visited);
        }
    }
}

static int numNextHops(Graph g, Vertex startVertex, bool *visited) {
    bool *newVisited = newVisitedArray(g);
    for (int i = 0; i < g -> nV; i++) newVisited[i] = visited[i];
    int numPathsFromStart = 0;
    for (Vertex neighbour = 0; neighbour < g -> nV; neighbour++) {
        if (adjacent(g, startVertex, neighbour) && !newVisited[neighbour]) {
            markVisited(g, neighbour, newVisited);
            numPathsFromStart++;
        }
    }
    return numPathsFromStart;
}

static void traversalTracer(Graph g, Vertex currVertex, bool *visited, int indentLevel, bool *levelConnector) {
    int currIndentLevel = indentLevel;
    while (currIndentLevel > 1) {
        if (levelConnector[indentLevel - currIndentLevel]) printColoured("purple", "┃");
        else printf(" ");
        for (int i = 0; i < 3; i++) printf(" ");
        currIndentLevel--;
    }
    if (currIndentLevel == 1) {
        if (levelConnector[indentLevel - currIndentLevel]) printColoured("purple", "┣");
        else printColoured("purple", "┗");
        printColoured("purple", "━━━");
    }
    printColoured("green", "%-2d\n", currVertex);
    visited[currVertex] = true;
    int numPathsFromStart = numNextHops(g, currVertex, visited);
    // printf("Num paths from start for %d : %d\n", currVertex, numPathsFromStart);
    for (Vertex w = 0; w < g -> nV; w++) {
        if (adjacent(g, currVertex, w) && !visited[w]) {
            bool hasUnder = false;
            if (numPathsFromStart > 1) hasUnder = true;
            if (hasUnder) {
                bool *nextLevelConnector = malloc(sizeof(int) * g -> nV);
                for (int i = 0; i < g -> nV; i++) nextLevelConnector[i] = levelConnector[i];
                nextLevelConnector[indentLevel] = true;
                traversalTracer(g, w, visited, indentLevel + 1, nextLevelConnector);
                numPathsFromStart--;
            } else {
                traversalTracer(g, w, visited, indentLevel + 1, levelConnector);
            }
        }
    }
}
