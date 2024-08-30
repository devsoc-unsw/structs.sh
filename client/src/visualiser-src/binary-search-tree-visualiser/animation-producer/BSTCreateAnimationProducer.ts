import GraphicalBSTNode from '../data-structure/GraphicalBSTNode';
import BSTInsertAnimationProducer from './BSTInsertAnimationProducer';

export default class BSTCreateAnimationProducer extends BSTInsertAnimationProducer {
  public createTree(root: GraphicalBSTNode | null): void {
    // base case
    if (root === null) {
      return;
    }
    // recursively traverse through each node in tree
    this.createNode(root);

    if (root.left !== null) {
      this.createTree(root.left);
      this.showLine(root.leftLineTarget);
    }
    if (root.right !== null) {
      this.createTree(root.right);
      this.showLine(root.rightLineTarget);
    }
  }
}
