import { v4 } from 'uuid';
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
import { assertUnreachable, cloneSimple } from '../util/util';
import { Parser } from './parser';

type LinkedListNode = {
  uid: Addr;
  data: string;
  next: Addr;
};

const LINKED_LIST_GAP = 200;
export class LinkedListParser implements Parser {
  convertToRootedTree(
    linkedList: LinkedListNode[],
    cacheLinkedListNode: Map<Addr, LinkedListNode>
  ): [LinkedListNode, Map<Addr, LinkedListNode[]>] {
    let root: LinkedListNode | null = null;
    const prevNodeMap: Map<Addr, LinkedListNode[]> = new Map();
    linkedList.forEach((node) => {
      if (node.next !== '0x0') {
        if (!prevNodeMap.has(node.next)) {
          prevNodeMap.set(node.next, []);
        }
        prevNodeMap.get(node.next)!.push(node);
      } else {
        root = node;
      }
    });
    linkedList.forEach((node) => {
      if (node.next === '0x0') {
        node.next = null;
      }
    });

    if (root === null) {
      throw new Error('No root node found! Not a valid tree');
    }

    const stack: LinkedListNode[] = [root];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (prevNodeMap.has(node.uid)) {
        const prevNodes = prevNodeMap.get(node.uid)!;
        prevNodes.forEach((prevNode) => {
          prevNode.next = node.uid; // Point the previous nodes to the current node
          stack.push(prevNode);
        });
      }
    }

    return [root, prevNodeMap];
  }

  // Recursion algorithm
  assignPositionsRecursion(
    currNode: LinkedListNode,
    prevNodeMap: Map<Addr, LinkedListNode[]>,
    cacheLinkedListNode: Map<Addr, LinkedListNode>,
    posCache: Map<Addr, { x: number; y: number }>,
    x: number,
    yRange: [number, number]
  ): {
    x: number;
    y: number;
  } {
    const prevNodes = prevNodeMap.get(currNode.uid);
    // Base case: The currNode is the last node
    if (!prevNodes) {
      posCache.set(currNode.uid, {
        x,
        y: (yRange[0] + yRange[1]) / 2,
      });
      return posCache.get(currNode.uid);
    }

    // Recursive case
    const yRangePerNode = (yRange[1] - yRange[0]) / prevNodes.length;
    let currY = yRange[0];
    const positions: {
      x: number;
      y: number;
    }[] = [];
    prevNodes.forEach((prevNode) => {
      positions.push(
        this.assignPositionsRecursion(
          prevNode,
          prevNodeMap,
          cacheLinkedListNode,
          posCache,
          x - LINKED_LIST_GAP,
          [currY, currY + yRangePerNode]
        )
      );
      currY += yRangePerNode;
    });

    // Choose the middle y value
    const y = positions.reduce((a, b) => a + b.y, 0) / positions.length;
    posCache.set(currNode.uid, {
      x,
      y,
    });
    return posCache.get(currNode.uid);
  }

  // TODO: Rewrite
  assignPositions(
    currNode: LinkedListNode,
    prevNodeMap: Map<Addr, LinkedListNode[]>,
    cacheLinkedListNode: Map<Addr, LinkedListNode>,
    horizontalDepth: number
  ): Map<Addr, { x: number; y: number }> {
    const posCache: Map<Addr, { x: number; y: number }> = new Map();
    this.assignPositionsRecursion(
      currNode,
      prevNodeMap,
      cacheLinkedListNode,
      posCache,
      horizontalDepth * LINKED_LIST_GAP + 100,
      [0, 200]
    );
    return posCache;
  }

  findMaxDepth(cacheLinkedListNode: Map<Addr, LinkedListNode[]>): number {
    // Utility function for DFS traversal
    function dfs(node: LinkedListNode | null, visited: Set<Addr>): number {
      if (!node) return 0; // base case: end of linked list
      if (visited.has(node.uid)) return 0; // loop detected, end traversal

      visited.add(node.uid);

      const nextNodes = cacheLinkedListNode.get(node.next);
      if (!nextNodes) return 1;

      let maxDepth = 0;
      nextNodes.forEach((nextNode: LinkedListNode) => {
        maxDepth = Math.max(maxDepth, dfs(nextNode, new Set(visited)));
      });

      return 1 + maxDepth;
    }

    let maximumDepth = 0;
    Array.from(cacheLinkedListNode.values()).forEach((nodes) => {
      nodes.forEach((node) => {
        maximumDepth = Math.max(maximumDepth, dfs(node, new Set()));
      });
    });
    return maximumDepth + 1;
  }

  /**
   * Parser functionality
   */
  parseInitialState(backendStructure: BackendState, editorAnnotation?: EditorAnnotation) {
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
            linkedList.push(
              cloneSimple({
                uid: uid as Addr,
                data: entity.data.value,
                next: entity.data.next,
              })
            );
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
      const [rootedTree, prevNodeMap] = this.convertToRootedTree(linkedList, cacheLinkedListNode);
      const maxDepth = this.findMaxDepth(prevNodeMap);
      const positions = this.assignPositions(
        rootedTree,
        prevNodeMap,
        cacheLinkedListNode,
        maxDepth
      );

      cacheLinkedListNode.forEach((node, uid) => {
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
      return undefined;
    }
  }

  updateState(
    frontendStructure: GenericGraph,
    backendStructure: BackendState,
    backendUpdate: BackendUpdate,
    editorAnnotation: EditorAnnotation
  ) {
    console.log('Update', frontendStructure, backendStructure, backendUpdate, editorAnnotation);
    return undefined;
  }
}
