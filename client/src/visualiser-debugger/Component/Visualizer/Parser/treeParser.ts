import { GlobalStateStore, useGlobalStore } from '../../../Store/globalStateStore';
import { UserAnnotation, DataStructureType, isTreeNode } from '../../../Types/annotationType';
import { Addr, BackendState } from '../../../Types/backendType';
import { EntityType } from '../Entities/BaseEntity/baseEntity';
import { EdgeEntity } from '../Entities/BaseEntity/edgeEntity';
import { NodeEntity, DEFAULT_NODE_SIZE } from '../Entities/BaseEntity/nodeEntity';
import { FrontendTreeGraph, EntityConcrete } from '../../../Types/frontendType';
import { assertUnreachable } from '../Util/util';
import { Parser } from './parser';

type TreeNode = {
  uid: Addr;
  data: string;
  left: Addr;
  right: Addr;
};
const TREE_GAP = 140;

export class TreeParser implements Parser {
  private assignPositionsRecursion(
    currNode: TreeNode | null,
    posCache: Map<Addr, { x: number; y: number }>,
    nodeCache: Map<Addr, TreeNode>,
    leftBoundary: number,
    rightBoundary: number,
    y: number
  ): {
    leftBoundary: number;
    rightBoundary: number;
    y: number;
  } | null {
    if (!currNode) return null;
    let leftBoundaryRet = leftBoundary;
    let rightBoundaryRet = leftBoundary;

    let leftRange: { leftBoundary: number; rightBoundary: number; y: number } | null = null;
    let rightRange: { leftBoundary: number; rightBoundary: number; y: number } | null = null;

    if (currNode.left) {
      const leftNode = nodeCache.get(currNode.left);
      if (leftNode) {
        leftRange = this.assignPositionsRecursion(
          leftNode,
          posCache,
          nodeCache,
          leftBoundary,
          rightBoundary,
          y + TREE_GAP * 1.4
        );
      }
    }

    // If there'e range in the left, we need to assign the current node on the right side of range
    if (leftRange) {
      posCache.set(currNode.uid, { x: leftRange.rightBoundary + TREE_GAP / 2, y });
      leftBoundaryRet = leftRange.rightBoundary + TREE_GAP / 2;
    } // We put the current node on the left boundry
    else {
      posCache.set(currNode.uid, { x: leftBoundary + TREE_GAP / 2, y });
      leftBoundaryRet += TREE_GAP / 2;
    }

    if (currNode.right) {
      const rightNode = nodeCache.get(currNode.right);
      if (rightNode) {
        rightRange = this.assignPositionsRecursion(
          rightNode,
          posCache,
          nodeCache,
          leftBoundary,
          rightBoundary,
          y + TREE_GAP * 1.4
        );
      }
    }

    // Now we merge range
    leftBoundaryRet = posCache.get(currNode.uid)!.x - TREE_GAP / 2;
    rightBoundaryRet = posCache.get(currNode.uid)!.x + TREE_GAP / 2;
    if (leftRange) {
      leftBoundaryRet = Math.min(leftRange.leftBoundary, leftBoundaryRet);
      rightBoundaryRet = Math.max(leftRange.rightBoundary, rightBoundaryRet);
    }
    if (rightRange) {
      leftBoundaryRet = Math.min(rightRange.leftBoundary, leftBoundaryRet);
      rightBoundaryRet = Math.max(rightRange.rightBoundary, rightBoundaryRet);
    }
    // Pick the middle reassign currNode
    if (currNode.left && currNode.right) {
      const posLeft = posCache.get(currNode.left);
      const posRight = posCache.get(currNode.right);

      // TODO: could posLeft or posRight be null?
      // @ts-ignore
      posCache.set(currNode.uid, { x: (posLeft.x + posRight.x) / 2, y });
    }

    return {
      leftBoundary: leftBoundaryRet,
      rightBoundary: rightBoundaryRet,
      y,
    };
  }

  private assignPositions(
    rootNode: TreeNode,
    treeNodes: Map<Addr, TreeNode>,
    globalState: GlobalStateStore
  ): Map<Addr, { x: number; y: number }> {
    const posCache: Map<Addr, { x: number; y: number }> = new Map();
    this.assignPositionsRecursion(
      rootNode,
      posCache,
      treeNodes,
      0,
      globalState.uiState.visualizerDimension.width,
      100
    );
    return posCache;
  }

  parseHeapData(backendStructure: BackendState, annotation: UserAnnotation): TreeNode[] {
    // Later need to add an additional step to parse user defined struct into generic struct
    const treeNodes: TreeNode[] = [];

    // === Get all linked list nodes from backend heap data
    Object.entries(annotation.typeAnnotation).forEach(([_, binaryAnnotation]) => {
      switch (binaryAnnotation.type) {
        case DataStructureType.BinaryTree: {
          Object.entries(backendStructure.heap_data).forEach(([uid, memoryValue]) => {
            if (isTreeNode(memoryValue, binaryAnnotation)) {
              treeNodes.push({
                uid: uid as Addr,
                // @ts-ignore
                data: memoryValue[binaryAnnotation.value.name].value,
                // @ts-ignore
                left: memoryValue[binaryAnnotation.left.name].value,
                // @ts-ignore
                right: memoryValue[binaryAnnotation.right.name].value,
              });
            }
          });
          break;
        }
        case DataStructureType.LinkedList: {
          break;
        }
        default: {
          assertUnreachable(binaryAnnotation);
        }
      }
    });

    treeNodes.forEach((node) => {
      if (node.left === '0x0') {
        // @ts-ignore
        node.left = null;
      }
      if (node.right === '0x0') {
        // @ts-ignore
        node.right = null;
      }
    });
    return treeNodes;
  }

  parseState(backendStructure: BackendState, editorAnnotation: UserAnnotation): FrontendTreeGraph {
    const nodes: NodeEntity[] = [];
    const edges: EdgeEntity[] = [];
    const cacheEntity: { [uid: string]: EntityConcrete } = {};
    const uiState = useGlobalStore.getState();

    const treeNodes: TreeNode[] = this.parseHeapData(backendStructure, editorAnnotation);

    const treeNodesMap: Map<Addr, TreeNode> = new Map();
    treeNodes.forEach((node) => {
      treeNodesMap.set(node.uid, node);
    });

    if (treeNodes.length === 0) {
      return {
        nodes,
        edges,
        cacheEntity,
        pointers: [],
      };
    }

    const rootNode = treeNodes[0];
    const positions = this.assignPositions(rootNode, treeNodesMap, uiState);
    treeNodes.forEach((node) => {
      const nodeEntity: NodeEntity = {
        uid: node.uid,
        type: EntityType.NODE,
        label: node.data ? node.data.toString() : '',
        colorHex: '#FFFFFF',
        size: DEFAULT_NODE_SIZE,
        edgeUids: [],
        // TODO: Could node be null?
        // @ts-ignore
        x: positions.get(node.uid).x,
        // @ts-ignore
        y: positions.get(node.uid).y,
      };
      nodes.push(nodeEntity);
      cacheEntity[node.uid] = nodeEntity;

      if (node.left) {
        const edgeEntityLeft: EdgeEntity = {
          uid: `${node.uid}-${node.left}`,
          type: EntityType.EDGE,
          fromNodeUid: node.uid,
          toNodeUid: node.left,
          label: '',
          colorHex: '#FFFFFF',
        };
        edges.push(edgeEntityLeft);
        cacheEntity[edgeEntityLeft.uid] = edgeEntityLeft;
        nodeEntity.edgeUids.push(edgeEntityLeft.uid);
      }

      if (node.right) {
        const edgeEntityRight: EdgeEntity = {
          uid: `${node.uid}-${node.right}`,
          type: EntityType.EDGE,
          fromNodeUid: node.uid,
          toNodeUid: node.right,
          label: '',
          colorHex: '#FFFFFF',
        };
        edges.push(edgeEntityRight);
        cacheEntity[edgeEntityRight.uid] = edgeEntityRight;
        nodeEntity.edgeUids.push(edgeEntityRight.uid);
      }
    });

    return {
      nodes,
      edges,
      cacheEntity,
      pointers: [],
    };
  }
}
