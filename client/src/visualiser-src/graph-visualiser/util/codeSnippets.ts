export const dfsCodeSnippet = `void dfs(int **M, int N, int src, bool *visited) {
    visited[src] = true;
    for (int v = 0; v < numVertices; v++) {
        if (M[src][v] && !visited[v]) {
            dfs(v);
        }
    }
}`;
