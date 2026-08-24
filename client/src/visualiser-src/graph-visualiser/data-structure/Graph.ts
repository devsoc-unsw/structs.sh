import { number } from 'prop-types';

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
    throw new Error(`Graph.delete(${vertex}) not implemented`);
  }

  /**
   * Adds one undirected edge. False if it would be a self-loop, if either endpoint
   * is missing, or if the edge already exists in either direction.
   */
  public addEdge(a: number, b: number): boolean {
    throw new Error(`Graph.addEdge(${a}, ${b}) not implemented`);
  }

  /** Removes one undirected edge. False if either endpoint or the edge is missing. */
  public deleteEdge(a: number, b: number): boolean {
    throw new Error(`Graph.deleteEdge(${a}, ${b}) not implemented`);
  }

  /* ---------- Queries: how the view reads the graph ---------- */

  public has(vertex: number): boolean {
    throw new Error(`Graph.has(${vertex}) not implemented`);
  }

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
