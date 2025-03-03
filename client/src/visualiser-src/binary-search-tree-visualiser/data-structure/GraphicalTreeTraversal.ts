import BSTTraverseAnimationProducer from '../animation-producer/BSTTraverseAnimationProducer';
import GraphicalBSTNode from './GraphicalBSTNode';

export default class GraphicalTreeTraversal {
  public static inorderTraversal(root: GraphicalBSTNode | null): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer();

    animationProducer.renderInorderTraversalCode();
    GraphicalTreeTraversal.doInorderTraversal(root, animationProducer);
    animationProducer.doAnimation(animationProducer.unhighlightBST, root);

    return animationProducer;
  }

  private static doInorderTraversal(
    node: GraphicalBSTNode | null,
    animationProducer: BSTTraverseAnimationProducer
  ) {
    if (node === null) {
      return;
    }

    animationProducer.doAnimationAndHighlight(2, animationProducer.halfHighlightNode, node);
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.highlightLine,
      node.leftLineTarget,
      node.leftArrowTarget
    );
    GraphicalTreeTraversal.doInorderTraversal(node.left, animationProducer);
    animationProducer.doAnimationAndHighlight(6, animationProducer.highlightNode, node);
    animationProducer.doAnimationAndHighlight(
      7,
      animationProducer.highlightLine,
      node.rightLineTarget,
      node.rightArrowTarget
    );
    GraphicalTreeTraversal.doInorderTraversal(node.right, animationProducer);
  }

  public static preorderTraversal(root: GraphicalBSTNode | null): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer();

    animationProducer.renderPreorderTraversalCode();
    GraphicalTreeTraversal.doPreorderTraversal(root, animationProducer);
    animationProducer.doAnimation(animationProducer.unhighlightBST, root);

    return animationProducer;
  }

  private static doPreorderTraversal(
    node: GraphicalBSTNode | null,
    animationProducer: BSTTraverseAnimationProducer
  ) {
    if (node === null) {
      return;
    }

    animationProducer.doAnimationAndHighlight(2, animationProducer.halfHighlightNode, node);
    animationProducer.doAnimationAndHighlight(5, animationProducer.highlightNode, node);
    animationProducer.doAnimationAndHighlight(
      6,
      animationProducer.highlightLine,
      node.leftLineTarget,
      node.leftArrowTarget
    );
    GraphicalTreeTraversal.doPreorderTraversal(node.left, animationProducer);
    animationProducer.doAnimationAndHighlight(
      7,
      animationProducer.highlightLine,
      node.rightLineTarget,
      node.rightArrowTarget
    );
    GraphicalTreeTraversal.doPreorderTraversal(node.right, animationProducer);
  }

  public static postorderTraversal(root: GraphicalBSTNode | null): BSTTraverseAnimationProducer {
    const animationProducer: BSTTraverseAnimationProducer = new BSTTraverseAnimationProducer();

    animationProducer.renderPostorderTraversalCode();
    GraphicalTreeTraversal.doPostorderTraversal(root, animationProducer);
    animationProducer.doAnimation(animationProducer.unhighlightBST, root);

    return animationProducer;
  }

  private static doPostorderTraversal(
    node: GraphicalBSTNode | null,
    animationProducer: BSTTraverseAnimationProducer
  ) {
    if (node === null) {
      return;
    }

    animationProducer.doAnimationAndHighlight(2, animationProducer.halfHighlightNode, node);
    animationProducer.doAnimationAndHighlight(
      5,
      animationProducer.highlightLine,
      node.leftLineTarget,
      node.leftArrowTarget
    );
    GraphicalTreeTraversal.doPostorderTraversal(node.left, animationProducer);
    animationProducer.doAnimationAndHighlight(
      6,
      animationProducer.highlightLine,
      node.rightLineTarget,
      node.rightArrowTarget
    );
    GraphicalTreeTraversal.doPostorderTraversal(node.right, animationProducer);
    animationProducer.doAnimationAndHighlight(7, animationProducer.highlightNode, node);
  }
}
