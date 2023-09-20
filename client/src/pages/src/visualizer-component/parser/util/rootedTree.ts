import { Graph, GraphNode } from './graph';

export class RootedTree {
  root: GraphNode;
  children: Map<string, RootedTree>;

  constructor(graph: Graph, rootUid: string) {
    const rootNode = graph.nodes.get(rootUid);
    if (!rootNode) {
      throw new Error('Root node does not exist in the graph');
    }

    this.root = rootNode;
    this.children = new Map();

    this.buildTree(graph, rootUid);
  }

  private buildTree(graph: Graph, currentUid: string): void {
    const edges = graph.edges.get(currentUid) || [];
    for (const edge of edges) {
      const childUid = edge.endNode;
      const childNode = graph.nodes.get(childUid);
      if (childNode) {
        const childTree = new RootedTree(graph, childUid);
        this.children.set(childUid, childTree);
      }
    }
  }

  traverse(visitNode: (node: GraphNode) => void, leaveNode: (node: GraphNode) => void): void {
    visitNode(this.root);
    this.children.forEach((childTree) => childTree.traverse(visitNode, leaveNode));
    leaveNode(this.root);
  }
}
