// line 3 = the vertex now exists, relayout the circle
export const insertCodeSnippet = `void GraphInsertVertex(Graph g, Vertex v) {
    if (hasVertex(g, v)) return;
    g->edges[v] = NULL;
    g->nV++;
}`;

// line 2 = mark the target red
// line 3 = fade out its incident edges
// line 5 = fade out the vertex
// line 7 = relayout what's left
export const deleteCodeSnippet = `void GraphRemoveVertex(Graph g, Vertex v) {
    for (Vertex w = 0; w < g->nV; w++) {
        GraphRemoveEdge(g, v, w);
    }
    freeAdjList(g->edges[v]);
    g->edges[v] = NULL;
    g->nV--;
}`;

// line 3 = draw the edge
export const addEdgeCodeSnippet = `void GraphInsertEdge(Graph g, Vertex v, Vertex w) {
    if (!GraphIsAdjacent(g, v, w)) {
        g->edges[v] = doInsertEdge(g->edges[v], w);
        g->edges[w] = doInsertEdge(g->edges[w], v);
        g->nE++;
    }
}`;

// line 2 = mark the edge red
// line 3 = fade it out
export const deleteEdgeCodeSnippet = `void GraphRemoveEdge(Graph g, Vertex v, Vertex w) {
    if (GraphIsAdjacent(g, v, w)) {
        g->edges[v] = doRemoveEdge(g->edges[v], w);
        g->edges[w] = doRemoveEdge(g->edges[w], v);
        g->nE--;
    }
}`;
