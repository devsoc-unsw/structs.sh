import {
  BackendState,
  EditorAnnotation,
  GenericGraph,
  BackendUpdate,
  EdgeEntity,
  EntityConcrete,
  NodeEntity,
  Addr,
  CType,
  BackendVariableConcrete,
  EntityType,
} from '../types/graphState';
import { NODE_MIN_DISTANCE } from '../types/uiState';
import { assertUnreachable } from '../util/util';
import { Parser } from './parser';

type LinkedListNode = {
  uid: Addr;
  data: string;
  next: Addr;
};

export class LinkedListParser implements Parser {
  convertToRootedTree(
    linkedList: LinkedListNode[],
    cacheLinkedListNode: Map<Addr, LinkedListNode>
  ): LinkedListNode {
    let root: LinkedListNode | null = null;
    const prevNodeMap: Map<Addr, LinkedListNode[]> = new Map();
    linkedList.forEach((node) => {
      if (node.next !== '0x0') {
        if (!prevNodeMap.has(node.next)) {
          prevNodeMap.set(node.next, []);
        }
        prevNodeMap.get(node.next)!.push(node);
      } else {
        root = node; // The root node will be the one that has no next node
      }
    });

    if (root === null) {
      throw new Error('No root node found! Not a valid tree');
    }

    const stack: LinkedListNode[] = [root];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (prevNodeMap.has(node.uid)) {
        if (node.next === '0x0') node.next = null;

        const prevNodes = prevNodeMap.get(node.uid)!;
        prevNodes.forEach((prevNode) => {
          prevNode.next = node.uid; // Point the previous nodes to the current node
          stack.push(prevNode);
        });
      }
    }

    return root;
  }

  // TODO: Rewrite
  assignPositions(
    root: LinkedListNode,
    cacheLinkedListNode: Map<Addr, LinkedListNode>
  ): Map<Addr, { x: number; y: number }> {
    const positions: Map<Addr, { x: number; y: number }> = new Map();
    const depthCount: Map<number, number> = new Map();
    const maxDepth = this.findMaxDepth(cacheLinkedListNode);

    const stack: { node: LinkedListNode; depth: number }[] = [{ node: root, depth: 0 }];
    while (stack.length > 0) {
      const { node, depth } = stack.pop()!;

      if (!depthCount.has(depth)) {
        depthCount.set(depth, 1);
      }
      const countAtDepth = depthCount.get(depth);
      positions.set(node.uid, {
        x: (maxDepth - depth) * NODE_MIN_DISTANCE,
        y: countAtDepth! * NODE_MIN_DISTANCE,
      });
      depthCount.set(depth, countAtDepth! + 1);

      const nextNode = cacheLinkedListNode.get(node.next!);
      if (nextNode) {
        stack.push({ node: nextNode, depth: depth + 1 });
      }
    }

    return positions;
  }

  findMaxDepth(cacheLinkedListNode: Map<Addr, LinkedListNode>): number {
    const values = Object.values(cacheLinkedListNode).map((node) => {
      let depth = 0;
      let currentNode = node;
      while (currentNode && currentNode.next) {
        depth++;
        currentNode = cacheLinkedListNode.get(currentNode.next)!;
      }
      return depth;
    });
    if (values.length <= 1) return 1;
    return values.reduce((a, b) => Math.max(a, b));
  }

  /**
   * Parser functionality
   */
  parseInitialState(backendStructure: BackendState, editorAnnotation: EditorAnnotation) {
    const nodes: NodeEntity[] = [];
    const edges: EdgeEntity[] = [];
    const cacheEntity: { [uid: string]: EntityConcrete } = {};

    // Later need to add an additional step to parse user defined struct into generic struct
    const linkedList: LinkedListNode[] = [];
    Object.keys(backendStructure).forEach((uid) => {
      const entity = backendStructure[uid] as BackendVariableConcrete;

      if (entity.is_pointer === true) {
        // Let it go, I am unsure why we need this
      } else {
        switch (entity.type) {
          case CType.DOUBLE_LINED_LIST_NODE: {
            /**
             * We need to think how to handle doubly linked list yep
             */
            break;
          }
          case CType.SINGLE_LINED_LIST_NODE: {
            linkedList.push({
              uid: uid as Addr,
              data: entity.data.data,
              next: entity.data.next,
            });
            break;
          }
          case CType.INT:
          case CType.DOUBLE:
          case CType.CHAR: {
            // Here is normal user variable??
            // We will handle this case later
            break;
          }
          default:
            assertUnreachable(entity);
        }
      }
    });

    const cacheLinkedListNode: Map<Addr, LinkedListNode> = new Map();
    linkedList.forEach((node) => {
      cacheLinkedListNode.set(node.uid, node);
    });

    try {
      const rootedTree = this.convertToRootedTree(linkedList, cacheLinkedListNode);
      const positions = this.assignPositions(rootedTree, cacheLinkedListNode);

      cacheLinkedListNode.forEach((node, uid) => {
        if (!positions.has(uid)) {
          console.log(`Invalid position for node ${uid}`, positions);
          return;
        }
        // Create NodeEntity from LinkedListNode
        const nodeEntity: NodeEntity = {
          uid,
          type: EntityType.NODE,
          title: node.data ? node.data.toString() : '',
          colorHex: '#FFFFFF',
          size: 50,
          edges: [],
          x: positions.get(uid).x,
          y: positions.get(uid).y,
        };
        nodes.push(nodeEntity);
        cacheEntity[uid] = nodeEntity;

        // If there's a next node, create an edge
        if (node.next) {
          const toNode = cacheLinkedListNode.get(node.next);
          if (toNode) {
            const edgeEntity: EdgeEntity = {
              uid: `${uid}-${node.next}`,
              type: EntityType.EDGE,
              from: uid,
              to: node.next,
              label: '',
              colorHex: '#FFFFFF',
            };
            edges.push(edgeEntity);
            cacheEntity[edgeEntity.uid] = edgeEntity;

            // Attach this edge to the node
            nodeEntity.edges.push(edgeEntity.uid);
          }
        }
      });

      return {
        nodes,
        edges,
        cacheEntity,
      };
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  updateState(
    frontendStructure: GenericGraph,
    backendStructure: BackendState,
    backendUpdate: BackendUpdate,
    editorAnnotation: EditorAnnotation
  ) {
    return undefined;
  }
}
