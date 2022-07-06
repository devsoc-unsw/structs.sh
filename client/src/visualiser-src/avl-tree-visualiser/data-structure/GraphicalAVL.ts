import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { Documentation } from 'visualiser-src/common/typedefs';
import { injectIds } from 'visualiser-src/common/helpers';
import GraphicalTreeTraversal from 'visualiser-src/binary-search-tree-visualiser/data-structure/GraphicalTreeTraversal';
import BSTTraverseAnimationProducer from 'visualiser-src/binary-search-tree-visualiser/animation-producer/BSTTraverseAnimationProducer';
import updateNodePositions from 'visualiser-src/binary-search-tree-visualiser/util/helpers';
import AVLAnimationProducer from '../animation-producer/AVLAnimationProducer';
import { Node } from '../util/typedefs';
import GraphicalAVLNode from './GraphicalAVLNode';

// used for the actual implementation of the bst
class GraphicalAVL extends GraphicalDataStructure {
  private static documentation: Documentation = injectIds({
    insert: {
      args: ['value'],
      description:
        'Executes standard AVL insertion to add a new node with the given value into the tree.',
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

  public root: GraphicalAVLNode = null;

  public insert(input: number): AVLAnimationProducer {
    const animationProducer: AVLAnimationProducer = new AVLAnimationProducer();
    if (this.root === null) {
      this.root = GraphicalAVLNode.from(input);
      updateNodePositions(this.root);
      animationProducer.doAnimation(animationProducer.createNode, this.root);
    } else {
      this.doInsert(null, this.root, false, input, animationProducer);
    }
    return animationProducer;
  }

  public balanceTree(node: Node, input: number, animationProducer: AVLAnimationProducer): void {}

  public inorderTraversal(): BSTTraverseAnimationProducer {
    return GraphicalTreeTraversal.inorderTraversal(this.root);
  }

  public preorderTraversal(): BSTTraverseAnimationProducer {
    return GraphicalTreeTraversal.preorderTraversal(this.root);
  }

  public postorderTraversal(): BSTTraverseAnimationProducer {
    return GraphicalTreeTraversal.postorderTraversal(this.root);
  }

  public get documentation() {
    return GraphicalAVL.documentation;
  }

  private doInsert(
    parent: GraphicalAVLNode,
    root: GraphicalAVLNode,
    isInsertLeft: boolean,
    input: number,
    animationProducer: AVLAnimationProducer
  ) {
    animationProducer.doAnimation(animationProducer.halfHighlightNode, root);
    if (root.value > input) {
      if (root.left == null) {
        root.left = GraphicalAVLNode.from(input);
        updateNodePositions(this.root);
        animationProducer.doAnimation(animationProducer.createNodeLeft, root.left, root);
      } else {
        animationProducer.doAnimation(
          animationProducer.highlightLine,
          root.leftLineTarget,
          root.leftArrowTarget
        );
        this.doInsert(root, root.left, true, input, animationProducer);
      }
    } else if (root.value < input) {
      if (root.right == null) {
        root.right = GraphicalAVLNode.from(input);
        updateNodePositions(this.root);
        animationProducer.doAnimation(animationProducer.createNodeRight, root.right, root);
      } else {
        animationProducer.doAnimation(
          animationProducer.highlightLine,
          root.rightLineTarget,
          root.rightArrowTarget
        );
        this.doInsert(root, root.right, false, input, animationProducer);
      }
    } else {
      // highlight root red
    }
    // Begin rebalancing
    root.updateHeight();
    console.log(root.height, root.balance);
    if (root.balance > 1) {
      console.log('left');
      if (input > root.left.value) {
        this.rotateLeft(root, root.left, true, animationProducer);
      }
      this.rotateRight(parent, root, isInsertLeft, animationProducer);
    } else if (root.balance < -1) {
      if (input < root.right.value) {
        this.rotateRight(root, root.right, false, animationProducer);
      }
      this.rotateLeft(parent, root, isInsertLeft, animationProducer);
    } else {
      animationProducer.doAnimation(animationProducer.unhighlightNodeAndPointers, root);
    }
  }

  private rotateLeft(
    parent: GraphicalAVLNode,
    node: GraphicalAVLNode,
    isInsertLeft: boolean,
    animationProducer: AVLAnimationProducer
  ) {
    if (node === null || node.right === null) {
      return;
    }
    const newRoot = node.right;
    if (newRoot.left != null) {
      animationProducer.doAnimationWithoutTimestamp(
        animationProducer.movePointerToNewRootLeftChild,
        node,
        newRoot
      );
      animationProducer.doAnimationWithoutTimestamp(
        animationProducer.moveLeftPointerToOldRoot,
        node,
        newRoot
      );
    } else {
      if (node.right != null) {
        animationProducer.doAnimationWithoutTimestamp(
          animationProducer.hideLine,
          node.rightLineTarget
        );
      }
      console.log('node: ', node.value, node.x, node.y);
      console.log('newRoot: ', newRoot.value, newRoot.x, newRoot.y);
      animationProducer.doAnimationWithoutTimestamp(
        animationProducer.assignNewRootLeftPointerToOldRoot,
        node,
        newRoot
      );
    }
    node.right = newRoot.left;
    newRoot.left = node;
    node.updateHeight();
    newRoot.updateHeight();
    if (parent === null) {
      this.root = newRoot;
    } else if (isInsertLeft) {
      parent.left = newRoot;
    } else {
      parent.right = newRoot;
    }
    updateNodePositions(this.root);
    animationProducer.doAnimation(animationProducer.updateAndUnhighlightBST, newRoot);
  }

  private rotateRight(
    parent: GraphicalAVLNode,
    node: GraphicalAVLNode,
    isInsertLeft: boolean,
    animationProducer: AVLAnimationProducer
  ) {
    if (node === null || node.left === null) {
      return;
    }
    const newRoot = node.left;
    if (newRoot.right != null) {
      animationProducer.doAnimationWithoutTimestamp(
        animationProducer.movePointerToNewRootRightChild,
        node,
        newRoot
      );
      animationProducer.doAnimationWithoutTimestamp(
        animationProducer.moveRightPointerToOldRoot,
        node,
        newRoot
      );
    } else {
      if (node.left != null) {
        animationProducer.doAnimationWithoutTimestamp(
          animationProducer.hideLine,
          node.leftLineTarget
        );
      }
      animationProducer.doAnimationWithoutTimestamp(
        animationProducer.assignNewRootRightPointerToOldRoot,
        node,
        newRoot
      );
    }
    node.left = newRoot.right;
    newRoot.right = node;
    node.updateHeight();
    newRoot.updateHeight();
    if (parent === null) {
      this.root = newRoot;
    } else if (isInsertLeft) {
      parent.left = newRoot;
    } else {
      parent.right = newRoot;
    }
    updateNodePositions(this.root);
    animationProducer.doAnimation(animationProducer.updateAndUnhighlightBST, newRoot);
  }
}

export default GraphicalAVL;
