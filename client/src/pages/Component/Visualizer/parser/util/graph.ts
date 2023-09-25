export interface GraphNode {
  uid: string;
  value: any;
}

export interface GraphEdge {
  startNode: string;
  endNode: string;
  weight: number;
}

export class Graph {
  nodes: Map<string, GraphNode>;

  edges: Map<string, GraphEdge[]>;

  constructor() {
    this.nodes = new Map();
    this.edges = new Map();
  }

  addNode(uid: string, value: any): void {
    const node: GraphNode = { uid, value };
    this.nodes.set(uid, node);
    this.edges.set(uid, []);
  }

  addEdge(startNode: string, endNode: string, weight: number): void {
    const edge: GraphEdge = { startNode, endNode, weight };
    this.edges.get(startNode)?.push(edge);
  }
}
