import { Addr, BackendState } from '../types/backendType';
import { EntityType } from '../types/entity/baseEntity';
import { EdgeEntity } from '../types/entity/edgeEntity';
import { DEFAULT_NODE_SIZE, NodeEntity } from '../types/entity/nodeEntity';
import { EntityConcrete, FrontendTreeGraph, GenericGraph } from '../types/frontendType';
import { UiState } from '../types/uiState';
import { assertUnreachable, cloneSimple } from '../util/util';
import { Parser } from './parser';

type TreeNode = {
  uid: Addr;
  data: string;
  left: Addr;
  right: Addr;
};
const TREE_GAP = 140;

export class TreeParser implements Parser {
  assignPositionsRecursion(
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
      leftBoundary = leftRange.rightBoundary + TREE_GAP / 2;
    } // We put the current node on the left boundry
    else {
      posCache.set(currNode.uid, { x: leftBoundary + TREE_GAP / 2, y });
      leftBoundary += TREE_GAP / 2;
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
    let leftBoundaryRet = posCache.get(currNode.uid).x - TREE_GAP / 2;
    let rightBoundaryRet = posCache.get(currNode.uid).x + TREE_GAP / 2;
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
      posCache.set(currNode.uid, { x: (posLeft.x + posRight.x) / 2, y });
    }

    return {
      leftBoundary: leftBoundaryRet,
      rightBoundary: rightBoundaryRet,
      y,
    };
  }

  assignPositions(
    rootNode: TreeNode,
    treeNodes: Map<Addr, TreeNode>,
    uiState: UiState
  ): Map<Addr, { x: number; y: number }> {
    const posCache: Map<Addr, { x: number; y: number }> = new Map();
    this.assignPositionsRecursion(rootNode, posCache, treeNodes, 0, uiState.x, 100);
    return posCache;
  }

  parseInitialState(
    backendStructure: BackendState,
    editorAnnotation: EditorAnnotation,
    uiState: UiState
  ): FrontendTreeGraph {
    const nodes: NodeEntity[] = [];
    const edges: EdgeEntity[] = [];
    const cacheEntity: { [uid: string]: EntityConcrete } = {};

    const treeNodes: TreeNode[] = [];
    Object.keys(backendStructure.heap_data).forEach((uid) => {
      const entity = backendStructure.heap_data[uid] as BackendVariableConcrete;
      // TODO: handle other entity types and pointer types
      if (entity.is_pointer === true) {
        // Let it go, I am unsure why we need this
      } else {
        switch (entity.type) {
          case CType.TREE_NODE: {
            treeNodes.push(
              cloneSimple({
                uid: uid as Addr,
                data: entity.value.value,
                left: entity.value.left,
                right: entity.value.right,
              })
            );
            break;
          }
          case CType.CHAR:
          case CType.DOUBLE:
          case CType.DOUBLE_LINED_LIST_NODE:
          case CType.INT:
          case CType.LINKED_LIST_NODE:
          case CType.LINKED_LIST_HEAD:
            break;
          default:
            assertUnreachable(entity);
        }
      }
    });
    treeNodes.forEach((node) => {
      if (node.left === '0x0') {
        node.left = null;
      }
      if (node.right === '0x0') {
        node.right = null;
      }
    });

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
        title: node.data ? node.data.toString() : '',
        colorHex: '#FFFFFF',
        size: DEFAULT_NODE_SIZE,
        edges: [],
        x: positions.get(node.uid).x,
        y: positions.get(node.uid).y,
      };
      nodes.push(nodeEntity);
      cacheEntity[node.uid] = nodeEntity;

      if (node.left) {
        const edgeEntityLeft: EdgeEntity = {
          uid: `${node.uid}-${node.left}`,
          type: EntityType.EDGE,
          from: node.uid,
          to: node.left,
          label: '',
          colorHex: '#FFFFFF',
        };
        edges.push(edgeEntityLeft);
        cacheEntity[edgeEntityLeft.uid] = edgeEntityLeft;
        nodeEntity.edges.push(edgeEntityLeft.uid);
      }

      if (node.right) {
        const edgeEntityRight: EdgeEntity = {
          uid: `${node.uid}-${node.right}`,
          type: EntityType.EDGE,
          from: node.uid,
          to: node.right,
          label: '',
          colorHex: '#FFFFFF',
        };
        edges.push(edgeEntityRight);
        cacheEntity[edgeEntityRight.uid] = edgeEntityRight;
        nodeEntity.edges.push(edgeEntityRight.uid);
      }
    });

    return {
      nodes,
      edges,
      cacheEntity,
      pointers: [],
    };
  }

  updateState(
    frontendStructure: GenericGraph,
    backendStructure: BackendState,
    backendUpdate: BackendUpdate,
    editorAnnotation: EditorAnnotation
  ) {
    // TODO: Implement updateState method
    return undefined;
  }
}
