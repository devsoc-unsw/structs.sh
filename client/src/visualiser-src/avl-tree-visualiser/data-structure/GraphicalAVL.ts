import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { Documentation } from 'visualiser-src/common/typedefs';
import { injectIds } from 'visualiser-src/common/helpers';
import GraphicalTreeTraversal from 'visualiser-src/binary-search-tree-visualiser/data-structure/GraphicalTreeTraversal';
import BSTTraverseAnimationProducer from 'visualiser-src/binary-search-tree-visualiser/animation-producer/BSTTraverseAnimationProducer';
import updateNodePositions from 'visualiser-src/binary-search-tree-visualiser/util/helpers';
import AVLInsertAnimationProducer from '../animation-producer/AVLInsertAnimationProducer';
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

  public insert(input: number) {}

  public balanceTree(
    node: Node,
    input: number,
    animationProducer: AVLInsertAnimationProducer
  ): void {}

  // returns the height of the tree
  public getHeight(node: Node): number {
    if (node === null) return 0;
    return Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

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
    root: GraphicalAVLNode,
    input: number,
    animationProducer: AVLInsertAnimationProducer
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
        this.doInsert(root.left as GraphicalAVLNode, input, animationProducer);
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
        this.doInsert(root.right as GraphicalAVLNode, input, animationProducer);
      }
    } else {
      // highlight root red
    }
    // Begin rebalancing
  }
}

export default GraphicalAVL;
