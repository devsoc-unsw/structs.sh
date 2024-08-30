import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { Documentation } from 'visualiser-src/common/typedefs';
import { injectIds } from 'visualiser-src/common/helpers';
import BSTInsertAnimationProducer from '../animation-producer/BSTInsertAnimationProducer';
import BSTRotateAnimationProducer from '../animation-producer/BSTRotateAnimationProducer';
import GraphicalBSTNode from './GraphicalBSTNode';
import GraphicalTreeTraversal from './GraphicalTreeTraversal';
import updateNodePositions from '../util/helpers';
import GraphicalTreeGenerate from './GraphicalTreeGenerate';
import BSTDeleteAnimationProducer from '../animation-producer/BSTDeleteAnimationProducer';

// used for the actual implementation of the bst
class GraphicalBST extends GraphicalDataStructure {
  private static documentation: Documentation = injectIds({
    insert: {
      args: ['value'],
      description:
        'Executes standard insertion to add a new node with the given value into the tree.',
    },
    delete: {
      args: ['value'],
      description: 'Executes a deletion on the node with the given value',
    },
    rotateLeft: {
      args: ['value'],
      description: 'Executes a left rotation on the node with the given value.',
    },
    rotateRight: {
      args: ['value'],
      description: 'Executes a right rotation on the node with the given value.',
    },
    inorderTraversal: {
      args: [],
      description: 'Executes an inorder traversal on the tree.',
    },
    preorderTraversal: {
      args: [],
      description: 'Executes a preorder traversal on the tree.',
    },
    postorderTraversal: {
      args: [],
      description: 'Executes a postorder traversal on the tree.',
    },
  });

  public root: GraphicalBSTNode | null = null;

  public insert(input: number): BSTInsertAnimationProducer {
    const animationProducer: BSTInsertAnimationProducer = new BSTInsertAnimationProducer();
    animationProducer.renderInsertCode();
    if (this.root === null) {
      this.root = GraphicalBSTNode.from(input);
      updateNodePositions(this.root);
      animationProducer.doAnimationAndHighlight(3, animationProducer.createNode, this.root, true);
      animationProducer.doAnimation(animationProducer.unhighlightBST, this.root);
    } else {
      this.doInsert(this.root, input, animationProducer);
      animationProducer.doAnimationAndHighlight(9, animationProducer.unhighlightBST, this.root);
    }
    return animationProducer;
  }

  public delete(input: number): BSTDeleteAnimationProducer {
    const animationProducer: BSTDeleteAnimationProducer = new BSTDeleteAnimationProducer();
    animationProducer.renderDeleteCode();
    const nodeExists = GraphicalBST.exists(this.root, input);
    this.root = this.deleteRecursive(this.root, null, input, animationProducer);
    if (nodeExists) {
      updateNodePositions(this.root);
      animationProducer.doAnimationAndHighlightTimestamp(
        22,
        false,
        animationProducer.updateBST,
        this.root
      );
      animationProducer.doAnimation(animationProducer.unhighlightBST, this.root);
    }
    return animationProducer;
  }

  private deleteRecursive(
    root: GraphicalBSTNode | null,
    parent: GraphicalBSTNode | null,
    input: number,
    animationProducer: BSTDeleteAnimationProducer
  ): GraphicalBSTNode | null {
    if (root == null) {
      animationProducer.doAnimationAndHighlight(3, animationProducer.unhighlightBST, this.root);
      return null;
    }
    let newRoot: GraphicalBSTNode | null = root;
    if (input < root.value) {
      animationProducer.doAnimationAndHighlight(6, animationProducer.halfHighlightNode, root);
      if (root.left !== null) {
        animationProducer.doAnimationAndHighlight(
          7,
          animationProducer.highlightLine,
          root.leftLineTarget,
          root.leftArrowTarget,
          true
        );
      }
      root.left = this.deleteRecursive(root.left, root, input, animationProducer);
    } else if (input > root.value) {
      animationProducer.doAnimationAndHighlight(8, animationProducer.halfHighlightNode, root);
      if (root.right !== null) {
        animationProducer.doAnimationAndHighlight(
          9,
          animationProducer.highlightLine,
          root.rightLineTarget,
          root.rightArrowTarget,
          true
        );
      }
      root.right = this.deleteRecursive(root.right, root, input, animationProducer);
    } else {
      animationProducer.doAnimationAndHighlight(10, animationProducer.highlightNode, root);
      if (root.left == null && root.right == null) {
        newRoot = null;
        animationProducer.doAnimationAndHighlight(
          20,
          animationProducer.freeNode,
          root,
          parent,
          true
        );
      } else {
        if (root.left == null) {
          newRoot = root.right;
        } else if (root.right == null) {
          newRoot = root.left;
        } else {
          newRoot = this.join(root.left, root.right, animationProducer);
        }
        animationProducer.doAnimationAndHighlight(
          20,
          animationProducer.freeNode,
          root,
          parent,
          false
        );
      }
    }
    return newRoot;
  }

  private join(
    root1: GraphicalBSTNode,
    root2: GraphicalBSTNode,
    animationProducer: BSTDeleteAnimationProducer
  ): GraphicalBSTNode {
    let curr = root2;
    let parent = null;
    while (curr.left !== null) {
      parent = curr;
      curr = curr.left;
    }
    if (parent !== null) {
      parent.left = curr.right;
      if (parent.left === null) {
        animationProducer.doAnimationAndHighlightTimestamp(
          18,
          false,
          animationProducer.hideLine,
          parent.leftLineTarget
        );
      } else {
        animationProducer.doAnimationAndHighlightTimestamp(
          18,
          false,
          animationProducer.moveLeftPointerToOldRoot,
          curr.right,
          parent
        );
      }
      if (curr.right === null) {
        animationProducer.doAnimationAndHighlightTimestamp(
          18,
          false,
          animationProducer.assignNewRootRightPointerToOldRoot,
          root2,
          curr
        );
      } else {
        animationProducer.doAnimationAndHighlightTimestamp(
          18,
          false,
          animationProducer.moveRightPointerToOldRoot,
          root2,
          curr
        );
      }
      curr.right = root2;
    }
    curr.left = root1;
    animationProducer.doAnimationAndHighlight(
      18,
      animationProducer.assignNewRootLeftPointerToOldRoot,
      root1,
      curr
    );

    return curr;
  }

  public generate(): void {
    this.root = GraphicalTreeGenerate.generate<GraphicalBSTNode>(GraphicalBSTNode.from);
  }

  public inorderTraversal() {
    return GraphicalTreeTraversal.inorderTraversal(this.root);
  }

  public preorderTraversal() {
    return GraphicalTreeTraversal.preorderTraversal(this.root);
  }

  public postorderTraversal() {
    return GraphicalTreeTraversal.postorderTraversal(this.root);
  }

  // returns a node corresponding to the input
  public getNode(input: number): GraphicalBSTNode | null {
    // handle edgecase where no nodes are present
    if (this.root === null) return null;

    return this.getNodeRecursive(input, this.root);
  }

  // TODO: remove this
  public getNodeRecursive(input: number, node: GraphicalBSTNode | null): GraphicalBSTNode | null {
    if (node === null) return null;
    if (input === node.value) return node;

    if (input < node.value) {
      return this.getNodeRecursive(input, node.left);
    }
    return this.getNodeRecursive(input, node.right);
  }

  // NOTE: There are a lot of non-null assertion operators in the code for rotations.
  // This is because the pre-condition that the value and the sub-tree for the rotation both exist.

  public rotateLeft(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer();
    animationProducer.renderRotateLeftCode();
    const oldRoot: GraphicalBSTNode | null = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: GraphicalBSTNode | null = oldRoot.right;

    if (newRoot === null) return animationProducer;

    this.root = this.doRotateLeft(this.root!, input, animationProducer);
    updateNodePositions(this.root);
    animationProducer.doAnimationAndHighlight(
      6,
      animationProducer.updateAndUnhighlightBST,
      this.root
    );

    return animationProducer;
  }

  public doRotateLeft(
    node: GraphicalBSTNode,
    input: number,
    animationProducer: BSTRotateAnimationProducer
  ): GraphicalBSTNode {
    if (input === node.value) {
      animationProducer.doAnimationAndHighlight(2, animationProducer.highlightNode, node);
      const newRoot: GraphicalBSTNode = node.right!;
      animationProducer.doAnimationAndHighlight(3, animationProducer.highlightNode, newRoot);

      if (newRoot.left != null) {
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.movePointerToNewRootLeftChild,
          node,
          newRoot
        );
        animationProducer.doAnimationAndHighlight(
          5,
          animationProducer.moveLeftPointerToOldRoot,
          node,
          newRoot
        );
      } else {
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.hideLine,
          node.rightLineTarget
        );
        animationProducer.doAnimationAndHighlight(
          5,
          animationProducer.assignNewRootLeftPointerToOldRoot,
          node,
          newRoot
        );
      }

      node.right = newRoot.left;
      newRoot.left = node;

      return newRoot;
    }
    if (input < node.value) {
      animationProducer.doAnimationAndHighlight(7, animationProducer.halfHighlightNode, node);
      animationProducer.doAnimationAndHighlight(
        8,
        animationProducer.highlightLine,
        node.leftLineTarget,
        node.leftArrowTarget
      );
      node.left = this.doRotateLeft(node.left!, input, animationProducer);
    } else {
      animationProducer.doAnimationAndHighlight(9, animationProducer.halfHighlightNode, node);
      animationProducer.doAnimationAndHighlight(
        10,
        animationProducer.highlightLine,
        node.rightLineTarget,
        node.rightArrowTarget
      );
      node.right = this.doRotateLeft(node.right!, input, animationProducer);
    }

    return node;
  }

  public rotateRight(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer();
    animationProducer.renderRotateRightCode();
    const oldRoot: GraphicalBSTNode | null = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: GraphicalBSTNode | null = oldRoot.left;

    if (newRoot === null) return animationProducer;

    this.root = this.doRotateRight(this.root!, input, animationProducer);
    updateNodePositions(this.root);
    animationProducer.doAnimationAndHighlight(
      6,
      animationProducer.updateAndUnhighlightBST,
      this.root
    );

    return animationProducer;
  }

  public doRotateRight(
    node: GraphicalBSTNode,
    input: number,
    animationProducer: BSTRotateAnimationProducer
  ): GraphicalBSTNode {
    if (input === node.value) {
      animationProducer.doAnimationAndHighlight(2, animationProducer.highlightNode, node);
      const newRoot: GraphicalBSTNode = node.left!;
      animationProducer.doAnimationAndHighlight(3, animationProducer.highlightNode, newRoot);

      if (newRoot.right != null) {
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.movePointerToNewRootRightChild,
          node,
          newRoot
        );
        animationProducer.doAnimationAndHighlight(
          5,
          animationProducer.moveRightPointerToOldRoot,
          node,
          newRoot
        );
      } else {
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.hideLine,
          node.leftLineTarget
        );
        animationProducer.doAnimationAndHighlight(
          5,
          animationProducer.assignNewRootRightPointerToOldRoot,
          node,
          newRoot
        );
      }

      node.left = newRoot.right;
      newRoot.right = node;

      return newRoot;
    }
    if (input < node.value) {
      animationProducer.doAnimationAndHighlight(7, animationProducer.halfHighlightNode, node);
      animationProducer.doAnimationAndHighlight(
        8,
        animationProducer.highlightLine,
        node.leftLineTarget,
        node.leftArrowTarget
      );
      node.left = this.doRotateRight(node.left!, input, animationProducer);
    } else {
      animationProducer.doAnimationAndHighlight(9, animationProducer.halfHighlightNode, node);
      animationProducer.doAnimationAndHighlight(
        10,
        animationProducer.highlightLine,
        node.rightLineTarget,
        node.rightArrowTarget
      );
      node.right = this.doRotateRight(node.right!, input, animationProducer);
    }

    return node;
  }

  public get documentation() {
    return GraphicalBST.documentation;
  }

  private doInsert(
    root: GraphicalBSTNode,
    input: number,
    animationProducer: BSTInsertAnimationProducer
  ) {
    if (root.value > input) {
      animationProducer.doAnimationAndHighlight(5, animationProducer.halfHighlightNode, root);
      animationProducer.doAnimationAndHighlight(
        6,
        animationProducer.highlightLine,
        root.leftLineTarget,
        root.leftArrowTarget,
        true
      );
      if (root.left == null) {
        root.left = GraphicalBSTNode.from(input);
        updateNodePositions(this.root);
        animationProducer.doAnimationAndHighlight(3, animationProducer.createNode, root.left, true);
      } else {
        this.doInsert(root.left, input, animationProducer);
      }
    } else if (root.value < input) {
      animationProducer.doAnimationAndHighlight(7, animationProducer.halfHighlightNode, root);
      animationProducer.doAnimationAndHighlight(
        8,
        animationProducer.highlightLine,
        root.rightLineTarget,
        root.rightArrowTarget,
        true
      );
      if (root.right == null) {
        root.right = GraphicalBSTNode.from(input);
        updateNodePositions(this.root);
        animationProducer.doAnimationAndHighlight(
          3,
          animationProducer.createNode,
          root.right,
          true
        );
      } else {
        this.doInsert(root.right, input, animationProducer);
      }
    } else {
      // highlight root red
      animationProducer.doAnimation(animationProducer.halfHighlightNodeRed, root);
      animationProducer.doAnimationAndHighlight(9, animationProducer.unhighlightBST, this.root);
    }
  }

  private static exists(root: GraphicalBSTNode | null, value: number): boolean {
    if (root == null) {
      return false;
    }
    if (root.value < value) {
      return this.exists(root.right, value);
    }
    if (root.value > value) {
      return this.exists(root.left, value);
    }
    return true;
  }

  public get data(): number[] {
    const data: number[] = [];

    this.saveInPreOrder(this.root, data);

    return data;
  }

  private saveInPreOrder(node: GraphicalBSTNode | null, data: number[]) {
    if (node == null) return;

    data.push(node.value);

    this.saveInPreOrder(node.left, data);

    this.saveInPreOrder(node.right, data);
  }

  public load(data: number[]): void {
    this.root = GraphicalTreeGenerate.loadTree<GraphicalBSTNode>(GraphicalBSTNode.from, data);
  }
}

export default GraphicalBST;
