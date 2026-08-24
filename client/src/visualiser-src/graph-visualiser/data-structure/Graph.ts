/**
 * An unweighted, undirected simple graph.
 *
 * Deliberately contains **no SVG.js, DOM, or React imports** — nothing in this file
 * knows it is being drawn. `GraphicalGraph` composes one of these and turns
 * successful mutations into animations; every "is this legal?" rule lives here so
 * the animation code never has to ask.
 *
 * Three invariants the implementation must hold:
 *
 * 1. **Undirected** — an edge is stored on *both* endpoints' lists.
 * 2. **Simple** — no self-loops, no duplicate edges in either direction.
 * 3. **Delete cascades** — removing a vertex removes every edge touching it, which
 *    means scrubbing it from all of its neighbours' lists too. Deleting only the key
 *    leaves dangling references, and `edges` would then report edges to a vertex
 *    that no longer exists.
 *
 * Every mutation returns whether it actually changed anything, so the caller can
 * skip animating a no-op.
 */
export default class Graph {
  /** Vertex -> its neighbours. The only state; everything else is derived. */
  private adjacency = new Map<number, number[]>();

  /* ---------- Mutations: return true only if the graph changed ---------- */

  /** Adds an isolated vertex. False if it is already present. */
  public insert(vertex: number): boolean {
    // check if the vertex exists
    if (this.adjacency.has(vertex)) return false;

    this.adjacency.set(vertex, []);
    return true;
  }

  /**
   * Removes a vertex and every edge touching it. False if it is not present.
   *
   * Callers that need to animate the removed edges must read `neighbours(vertex)`
   * *before* calling this — afterwards that information is gone.
   */
  public delete(vertex: number): boolean {
    const neighbours = this.adjacency.get(vertex);
    if (neighbours === undefined) return false;

    // Scrub the vertex from both directions of every incident edge. Deleting only
    // the key would leave each neighbour holding a dangling reference, and `edges`
    // would keep reporting edges to a vertex that no longer exists.
    neighbours.forEach((w) => {
      this.adjacency.set(
        w,
        (this.adjacency.get(w) ?? []).filter((x) => x !== vertex)
      );
    });

    this.adjacency.delete(vertex);
    return true;
  }

  /**
   * Adds one undirected edge. False if it would be a self-loop, if either endpoint
   * is missing, or if the edge already exists in either direction.
   */
  public addEdge(a: number, b: number): boolean {
    if (a === b) return false;

    const neighboursA = this.adjacency.get(a);
    const neighboursB = this.adjacency.get(b);
    if (neighboursA === undefined || neighboursB === undefined) return false;

    // Undirected, so `a` knowing `b` implies the reverse — checking one side is
    // enough, and a disagreement between the two would be a bug worth surfacing.
    if (neighboursA.includes(b)) return false;

    neighboursA.push(b);
    neighboursB.push(a);
    return true;
  }

  /** Removes one undirected edge. False if either endpoint or the edge is missing. */
  public deleteEdge(a: number, b: number): boolean {
    // check that they're not the same
    if (a === b) {
      return false;
    }

    // check that both vertices exist
    const neighboursA = this.adjacency.get(a);
    const neighboursB = this.adjacency.get(b);

    if (neighboursA === undefined || neighboursB === undefined) return false;
    if (!neighboursA.includes(b)) return false;

    // `filter` returns a new array rather than mutating, so the results have to be
    // written back into the map — unlike `addEdge`, where `push` mutates in place.
    this.adjacency.set(
      a,
      neighboursA.filter((x) => x !== b)
    );
    this.adjacency.set(
      b,
      neighboursB.filter((x) => x !== a)
    );

    return true;
  }

  /* ---------- Queries: how the view reads the graph ---------- */
  /**
   * This vertex's neighbours, ascending. Must return a **copy** — callers must not
   * be able to mutate the adjacency list through the array they get back.
   */
  public neighbours(vertex: number): number[] {
    throw new Error(`Graph.neighbours(${vertex}) not implemented`);
  }

  /** All vertices, ascending. The view turns this into circular positions. */
  public get vertices(): number[] {
    throw new Error('Graph.vertices not implemented');
  }

  /**
   * Every edge exactly once, each as a canonical `[min, max]` pair. This is what the
   * renderer draws, so returning both `[a, b]` and `[b, a]` would double every line.
   */
  public get edges(): [number, number][] {
    throw new Error('Graph.edges not implemented');
  }
}
