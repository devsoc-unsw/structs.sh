// unweighted, undirected simple graph. no svg or react in here, it's just the data.
// GraphicalGraph wraps one of these and turns the true/false results into animations.
//
// rules: every edge is stored on both vertices, no self loops, no duplicates, and
// deleting a vertex also strips it out of its neighbours' lists.
export default class Graph {
  // vertex -> its neighbours. everything else is derived from this
  private adjacency = new Map<number, number[]>();

  /* ---------- Mutations: return true only if the graph changed ---------- */

  // adds a lone vertex. false if it's already there
  public insert(vertex: number): boolean {
    // check if the vertex exists
    if (this.adjacency.has(vertex)) return false;

    this.adjacency.set(vertex, []);
    return true;
  }

  // removes a vertex and every edge touching it. false if it doesn't exist.
  // read neighbours() first if you want to animate those edges, they're gone after this
  public delete(vertex: number): boolean {
    const neighbours = this.adjacency.get(vertex);
    if (neighbours === undefined) return false;

    // take the vertex out of each neighbour's list too, otherwise edges() keeps
    // reporting edges to something that isn't there anymore
    neighbours.forEach((w) => {
      this.adjacency.set(
        w,
        (this.adjacency.get(w) ?? []).filter((x) => x !== vertex)
      );
    });

    this.adjacency.delete(vertex);
    return true;
  }

  // adds one undirected edge. false on a self loop, a missing vertex, or a duplicate
  public addEdge(a: number, b: number): boolean {
    if (a === b) return false;

    const neighboursA = this.adjacency.get(a);
    const neighboursB = this.adjacency.get(b);
    if (neighboursA === undefined || neighboursB === undefined) return false;

    // undirected, so if a knows b then b knows a. checking one side is enough
    if (neighboursA.includes(b)) return false;

    neighboursA.push(b);
    neighboursB.push(a);
    return true;
  }

  // removes one undirected edge. false if a vertex or the edge is missing
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

    // filter makes a new array instead of mutating, so write it back into the map.
    // addEdge doesn't need this because push edits in place
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

  public has(vertex: number): boolean {
    return this.adjacency.has(vertex);
  }

  // ascending, and a copy. hand back the real array and callers can mutate our state
  public neighbours(vertex: number): number[] {
    return [...(this.adjacency.get(vertex) ?? [])].sort((x, y) => x - y);
  }

  // ascending. the view feeds this into circularPositions()
  public get vertices(): number[] {
    return Array.from(this.adjacency.keys()).sort((a, b) => a - b);
  }

  // each edge once, as [min, max]. returning both [a, b] and [b, a] would make the
  // renderer draw every line twice
  public get edges(): [number, number][] {
    // we have a set to keep track of the edges so that they're not added twice.
    const seen = new Set<string>();
    const out: [number, number][] = [];
    this.vertices.forEach((v) => {
      this.neighbours(v).forEach((w) => {
        // sorts the edges by ascending order of vertex number
        const [lo, hi] = v < w ? [v, w] : [w, v];
        const key = `${lo}-${hi}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push([lo, hi]);
        }
      });
    });
    return out;
  }
}
