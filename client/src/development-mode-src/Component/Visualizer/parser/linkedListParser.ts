import { UserAnnotation, DataStructureType, isLinkedListNode } from '../../../Types/annotationType';
import { Addr, BackendState } from '../../../Types/backendType';
import { EntityType } from '../../../Types/entity/baseEntity';
import { EdgeEntity } from '../../../Types/entity/edgeEntity';
import { NodeEntity, DEFAULT_NODE_SIZE } from '../../../Types/entity/nodeEntity';
import { PointerEntity } from '../../../Types/entity/pointerEntity';
import { FrontendLinkedListGraph, EntityConcrete } from '../../../Types/frontendType';
import { assertUnreachable } from '../util/util';
import { Parser } from './parser';
import { UnionFind } from './util/unionFind';

type LinkedListNode = {
  uid: Addr;
  data: string;
  next: Addr;
};

const LINKED_LIST_GAP = 200;
export class LinkedListParser implements Parser {
  private convertToRootedTree(
    linkedList: LinkedListNode[]
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
      return [null, prevNodeMap];
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
  private assignPositionsRecursion(
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
        y: (yRange[0] + 100) / 2,
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
  private assignPositions(
    currNode: LinkedListNode,
    prevNodeMap: Map<Addr, LinkedListNode[]>,
    cacheLinkedListNode: Map<Addr, LinkedListNode>,
    horizontalDepth: number,
    initialYRange: [number, number]
  ): Map<Addr, { x: number; y: number }> {
    const posCache: Map<Addr, { x: number; y: number }> = new Map();
    this.assignPositionsRecursion(
      currNode,
      prevNodeMap,
      cacheLinkedListNode,
      posCache,
      horizontalDepth * LINKED_LIST_GAP,
      initialYRange
    );
    return posCache;
  }

  private findMaxDepth(
    cacheLinkedListNode: Map<Addr, LinkedListNode[]>,
    linkedList: LinkedListNode[]
  ): number {
    // Reverase cache linkedList as we want trakck back
    const cacheLinkedListNodeReverse: Map<Addr, LinkedListNode[]> = new Map();
    cacheLinkedListNode.forEach((nodes) => {
      nodes.forEach((node) => {
        if (!cacheLinkedListNodeReverse.has(node.uid)) {
          cacheLinkedListNodeReverse.set(node.uid, []);
        }
        cacheLinkedListNodeReverse.get(node.uid)!.push(node);
      });
    });

    // Utility function for DFS traversal
    function dfs(node: LinkedListNode | null, visited: Set<Addr>): number {
      if (!node) return 0; // base case: end of linked list
      if (visited.has(node.uid)) return 0; // loop detected, end traversal

      visited.add(node.uid);

      const nextNodes = cacheLinkedListNodeReverse.get(node.next);
      if (!nextNodes) return 1;

      let maxDepth = 0;
      nextNodes.forEach((nextNode: LinkedListNode) => {
        maxDepth = Math.max(maxDepth, dfs(nextNode, new Set(visited)));
      });
      return 1 + maxDepth;
    }

    let maximumDepth = 0;
    linkedList.forEach((node) => {
      maximumDepth = Math.max(maximumDepth, dfs(node, new Set()));
    });
    return maximumDepth + 1;
  }

  parseHeapData(backendStructure: BackendState, annotation: UserAnnotation): LinkedListNode[] {
    // Later need to add an additional step to parse user defined struct into generic struct
    const linkedList: LinkedListNode[] = [];

    // === Get all linked list nodes from backend heap data
    Object.entries(annotation.typeAnnotation).forEach(([_, linkedListAnnotation]) => {
      switch (linkedListAnnotation.type) {
        case DataStructureType.BinaryTree: {
          break;
        }
        case DataStructureType.LinkedList: {
          Object.entries(backendStructure.heap_data).forEach(([uid, heapValue]) => {
            if (isLinkedListNode(heapValue, linkedListAnnotation)) {
              const linkedListNode: LinkedListNode = {
                uid: uid as Addr,
                data: heapValue.value[linkedListAnnotation.value.name].value,
                next: heapValue.value[linkedListAnnotation.next.name].value,
              };
              linkedList.push(linkedListNode);
            }
          });
          break;
        }
        default: {
          assertUnreachable(linkedListAnnotation);
        }
      }
    });
    return linkedList;
  }

  /**
   * Parser functionality
   */
  parseState(backendStructure: BackendState, annotation: UserAnnotation): FrontendLinkedListGraph {
    const nodes: NodeEntity[] = [];
    const edges: EdgeEntity[] = [];
    const cacheEntity: { [uid: string]: EntityConcrete } = {};
    const pointers: PointerEntity[] = [];

    // Later need to add an additional step to parse user defined struct into generic struct
    const linkedList: LinkedListNode[] = this.parseHeapData(backendStructure, annotation);

    const cacheLinkedListNode: Map<Addr, LinkedListNode> = new Map();
    linkedList.forEach((node) => {
      cacheLinkedListNode.set(node.uid, node);
    });

    const unionNodes = new Set<string>();
    linkedList.forEach((node) => {
      unionNodes.add(node.uid);
      if (node.next !== '0x0') {
        unionNodes.add(node.next);
      }
    });
    const unionFind = new UnionFind(unionNodes);

    // Combine
    linkedList.forEach((node) => {
      if (node.next !== '0x0') {
        unionFind.union(node.uid, node.next);
      }
    });

    const nodesPosition: Map<
      Addr,
      {
        x: number;
        y: number;
      }
    > = new Map();
    try {
      const groups = unionFind.getGroups();
      let idx = 0;

      groups.forEach((group) => {
        const linkedListGroupNodes: LinkedListNode[] = [];
        group.forEach((uid) => {
          const node = cacheLinkedListNode.get(uid as Addr);
          if (node) linkedListGroupNodes.push(node);
        });

        if (linkedListGroupNodes.length === 0) {
          return;
        }

        const [rootedTree, prevNodeMap] = this.convertToRootedTree(linkedListGroupNodes);
        const maxDepth = this.findMaxDepth(prevNodeMap, linkedListGroupNodes);
        const positions = this.assignPositions(
          rootedTree,
          prevNodeMap,
          cacheLinkedListNode,
          maxDepth,
          [600 * idx, 900 + 600 * idx]
        );

        positions.forEach((pos, uid) => {
          nodesPosition.set(uid, pos);
        });

        idx += 1;
      });

      cacheLinkedListNode.forEach((node, uid) => {
        // Create NodeEntity from LinkedListNode
        const nodeEntity: NodeEntity = {
          uid,
          type: EntityType.NODE,
          title: node.data ? node.data.toString() : '??',
          colorHex: '#FFFFFF',
          size: DEFAULT_NODE_SIZE,
          edges: [],
          x: nodesPosition.get(uid).x,
          y: nodesPosition.get(uid).y,
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

      // === Get linked list node pointers from the backend stack data
      const { stackAnnotation } = annotation;
      Object.entries(backendStructure.stack_data).forEach(([name, memoryValue]) => {
        if (stackAnnotation === undefined) return;
        if (!stackAnnotation[name]) return;
        if (stackAnnotation[name] === undefined || stackAnnotation[name] === null) return;

        const prevPointer: PointerEntity | null = pointers.find(
          (pointer) => pointer.attachedUid === cacheEntity[memoryValue.value as string].uid
        );
        if (prevPointer) {
          prevPointer.varName += `, ${name}`;
          return;
        }

        const annotationEntity: PointerEntity = {
          uid: `${name}`,
          type: EntityType.POINTER,
          attachedUid: cacheEntity[memoryValue.value as string].uid,
          varName: name,
        };
        pointers.push(annotationEntity);
        cacheEntity[annotationEntity.uid] = annotationEntity;
      });

      return {
        nodes,
        edges,
        cacheEntity,
        pointers,
      };
    } catch (e) {
      // Not silent fail
      console.error(e.message);
      return undefined;
    }
  }
}
