import { SVG, Container } from '@svgdotjs/svg.js';
import GraphicalDataStructure from 'visualiser-src/common/GraphicalDataStructure';
import { Documentation } from 'visualiser-src/common/typedefs';
import { VISUALISER_CANVAS } from 'visualiser-src/common/constants';
import { injectIds } from 'visualiser-src/common/helpers';
import BSTInsertAnimationProducer from '../animation-producer/BSTInsertAnimationProducer';
import BSTRotateAnimationProducer from '../animation-producer/BSTRotateAnimationProducer';
import BSTTraverseAnimationProducer from '../animation-producer/BSTTraverseAnimationProducer';
import { Node } from '../util/typedefs';
import { canvasPadding } from '../util/settings';
import { insertBalancedBSTNumbers } from 'visualiser-src/common/RandomNumGenerator';


// used for the actual implementation of the bst
class GraphicalBST extends GraphicalDataStructure {
  private static documentation: Documentation = injectIds({
    insert: {
      args: ['value'],
      description:
        'Executes standard BST insertion to add a new node with the given value into the tree.',
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

  public root: Node = null;

  // inserts a node into the bst and produces an animation sequence
  // that is later handled by the animation controller
  public insert(input: number): BSTInsertAnimationProducer {
    const animationProducer: BSTInsertAnimationProducer = new BSTInsertAnimationProducer();
    animationProducer.renderInsertCode();

    // return early if a node with the same value already exists
    if (this.getNode(input) !== null) {
      return animationProducer;
    }

    const node: Node = {
      nodeTarget: null,
      textTarget: null,
      leftLineTarget: null,
      rightLineTarget: null,
      leftArrowTarget: null,
      rightArrowTarget: null,
      left: null,
      right: null,
      value: input,
      x: 0,
      y: 0,
    };

    if (this.root == null) {
      this.root = node;
      this.updateNodePositions();
      animationProducer.doAnimationAndHighlight(2, animationProducer.createNode, node);
    } else {
      let currentNode: Node = this.root;

      while (currentNode) {
        animationProducer.doAnimationAndHighlight(
          6,
          animationProducer.halfHighlightNode,
          currentNode
        );

        if (node.value < currentNode.value) {
          if (currentNode.left == null) {
            currentNode.left = node;
            this.updateNodePositions();
            animationProducer.doAnimationAndHighlight(
              8,
              animationProducer.createNodeLeft,
              node,
              currentNode
            );
            animationProducer.doAnimationAndHighlight(
              9,
              animationProducer.unhighlightBST,
              this.root
            );

            return animationProducer;
          }

          animationProducer.doAnimationAndHighlight(
            11,
            animationProducer.highlightLine,
            currentNode.leftLineTarget,
            currentNode.leftArrowTarget
          );

          currentNode = currentNode.left;
        } else {
          if (currentNode.right == null) {
            currentNode.right = node;
            this.updateNodePositions();
            animationProducer.doAnimationAndHighlight(
              14,
              animationProducer.createNodeRight,
              node,
              currentNode
            );
            animationProducer.doAnimationAndHighlight(
              15,
              animationProducer.unhighlightBST,
              this.root
            );

            return animationProducer;
          }

          animationProducer.doAnimationAndHighlight(
            17,
            animationProducer.highlightLine,
            currentNode.rightLineTarget,
            currentNode.rightArrowTarget
          );

          currentNode = currentNode.right;
        }
      }
    }

    animationProducer.doAnimation(animationProducer.unhighlightBST, this.root);
    return animationProducer;
  }

  public insertRandomGeneratedNodes(): void {
      const num = insertBalancedBSTNumbers();
      num.forEach(element => {this.insert(element)});
  }

  // use this method after doing bst operations to update
  // x and y coordinates
  public updateNodePositions(): void {
    const canvasWidth = document.getElementById('visualiser-container').offsetWidth;
    const low: number = 0;
    const high: number = Number(canvasWidth);
    const mid: number = (low + high) / 2;
    this.updateNodePositionsRecursive(this.root, low, high, mid, canvasPadding);
  }

  public updateNodePositionsRecursive(
    node: Node,
    low: number,
    high: number,
    mid: number,
    y: number
  ): void {
    if (node === null) {
      return;
    }

    node.x = mid;
    node.y = y;

    this.updateNodePositionsRecursive(node.left, low, mid, (low + mid) / 2, y + 75);
    this.updateNodePositionsRecursive(node.right, mid, high, (mid + high) / 2, y + 75);
  }

  // returns a node corresponding to the input
  public getNode(input: number): Node {
    // handle edgecase where no nodes are present
    if (this.root === null) return null;

    return this.getNodeRecursive(input, this.root);
  }

  // TODO: remove this
  public getNodeRecursive(input: number, node: Node): Node {
    if (node === null) return null;
    if (input === node.value) return node;

    if (input < node.value) {
      return this.getNodeRecursive(input, node.left);
    }
    return this.getNodeRecursive(input, node.right);
  }

  public rotateLeft(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer();
    animationProducer.renderRotateLeftCode();
    const oldRoot: Node = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: Node = oldRoot.right;

    if (newRoot === null) return animationProducer;

    this.root = this.doRotateLeft(this.root, input, animationProducer);
    this.updateNodePositions();
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.updateAndUnhighlightBST,
      this.root
    );

    return animationProducer;
  }

  public doRotateLeft(
    node: Node,
    input: number,
    animationProducer: BSTRotateAnimationProducer
  ): Node {
    animationProducer.doAnimationAndHighlight(1, animationProducer.halfHighlightNode, node);
    if (input === node.value) {
      const newRoot: Node = node.right;

      if (newRoot.left != null) {
        animationProducer.doAnimationAndHighlight(
          3,
          animationProducer.movePointerToNewRootLeftChild,
          node,
          newRoot
        );
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.moveLeftPointerToOldRoot,
          node,
          newRoot
        );
      } else {
        animationProducer.doAnimation(animationProducer.hideLine, node.rightLineTarget);
        animationProducer.doAnimationAndHighlight(
          4,
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
      animationProducer.doAnimationAndHighlight(
        7,
        animationProducer.highlightLine,
        node.leftLineTarget,
        node.leftArrowTarget
      );
      node.left = this.doRotateLeft(node.left, input, animationProducer);
    } else {
      animationProducer.doAnimationAndHighlight(
        9,
        animationProducer.highlightLine,
        node.rightLineTarget,
        node.rightArrowTarget
      );
      node.right = this.doRotateLeft(node.right, input, animationProducer);
    }

    return node;
  }

  public rotateRight(input: number): BSTRotateAnimationProducer {
    const animationProducer: BSTRotateAnimationProducer = new BSTRotateAnimationProducer();
    animationProducer.renderRotateRightCode();
    const oldRoot: Node = this.getNode(input);

    if (oldRoot === null) return animationProducer;

    const newRoot: Node = oldRoot.left;

    if (newRoot === null) return animationProducer;

    this.root = this.doRotateRight(this.root, input, animationProducer);
    this.updateNodePositions();
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.updateAndUnhighlightBST,
      this.root
    );

    return animationProducer;
  }

  public doRotateRight(
    node: Node,
    input: number,
    animationProducer: BSTRotateAnimationProducer
  ): Node {
    animationProducer.doAnimationAndHighlight(1, animationProducer.halfHighlightNode, node);
    if (input === node.value) {
      const newRoot: Node = node.left;

      if (newRoot.right != null) {
        animationProducer.doAnimationAndHighlight(
          3,
          animationProducer.movePointerToNewRootRightChild,
          node,
          newRoot
        );
        animationProducer.doAnimationAndHighlight(
          4,
          animationProducer.moveRightPointerToOldRoot,
          node,
          newRoot
        );
      } else {
        animationProducer.doAnimation(animationProducer.hideLine, node.leftLineTarget);
        animationProducer.doAnimationAndHighlight(
          4,
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
      animationProducer.doAnimationAndHighlight(
        7,
        animationProducer.highlightLine,
        node.leftLineTarget,
        node.leftArrowTarget
      );
      node.left = this.doRotateRight(node.left, input, animationProducer);
    } else {
      animationProducer.doAnimationAndHighlight(
        9,
        animationProducer.highlightLine,
        node.rightLineTarget,
        node.rightArrowTarget
      );
      node.right = this.doRotateRight(node.right, input, animationProducer);
    }

    return node;
  }

  public inorderTraversal(): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer();

    animationProducer.renderInorderTraversalCode();
    this.doInorderTraversal(this.root, animationProducer);
    animationProducer.doAnimation(animationProducer.unhighlightBST, this.root);

    return animationProducer;
  }

  public doInorderTraversal(node: Node, animationProducer: BSTTraverseAnimationProducer) {
    if (node === null) {
      return;
    }

    animationProducer.doAnimationAndHighlight(1, animationProducer.halfHighlightNode, node);
    animationProducer.doAnimationAndHighlight(
      4,
      animationProducer.highlightLine,
      node.leftLineTarget,
      node.leftArrowTarget
    );
    this.doInorderTraversal(node.left, animationProducer);
    animationProducer.doAnimationAndHighlight(5, animationProducer.highlightNode, node);
    animationProducer.doAnimationAndHighlight(
      6,
      animationProducer.highlightLine,
      node.rightLineTarget,
      node.rightArrowTarget
    );
    this.doInorderTraversal(node.right, animationProducer);
  }

  public preorderTraversal(): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer();

    animationProducer.renderPreorderTraversalCode();
    this.doPreorderTraversal(this.root, animationProducer);
    animationProducer.doAnimation(animationProducer.unhighlightBST, this.root);

    return animationProducer;
  }

  public doPreorderTraversal(node: Node, animationProducer: BSTTraverseAnimationProducer) {
    if (node === null) {
      return;
    }

    animationProducer.doAnimationAndHighlight(1, animationProducer.halfHighlightNode, node);
    animationProducer.doAnimationAndHighlight(4, animationProducer.highlightNode, node);
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.highlightLine,
      node.leftLineTarget,
      node.leftArrowTarget
    );
    this.doPreorderTraversal(node.left, animationProducer);
    animationProducer.doAnimationAndHighlight(
      6,
      animationProducer.highlightLine,
      node.rightLineTarget,
      node.rightArrowTarget
    );
    this.doPreorderTraversal(node.right, animationProducer);
  }

  public postorderTraversal(): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer();

    animationProducer.renderPostorderTraversalCode();
    this.doPostorderTraversal(this.root, animationProducer);
    animationProducer.doAnimation(animationProducer.unhighlightBST, this.root);

    return animationProducer;
  }

  public doPostorderTraversal(node: Node, animationProducer: BSTTraverseAnimationProducer) {
    if (node === null) {
      return;
    }

    animationProducer.doAnimationAndHighlight(1, animationProducer.halfHighlightNode, node);
    animationProducer.doAnimationAndHighlight(
      4,
      animationProducer.highlightLine,
      node.leftLineTarget,
      node.leftArrowTarget
    );
    this.doPostorderTraversal(node.left, animationProducer);
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.highlightLine,
      node.rightLineTarget,
      node.rightArrowTarget
    );
    this.doPostorderTraversal(node.right, animationProducer);
    animationProducer.doAnimationAndHighlight(6, animationProducer.highlightNode, node);
  }

  public reset(): void {
    SVG(VISUALISER_CANVAS).clear();
    this.root = null;
  }

  public get documentation() {
    return GraphicalBST.documentation;
  }
}

export default GraphicalBST;
