import BSTInsertAnimationProducer from 'visualiser-src/binary-search-tree-visualiser/animation-producer/BSTInsertAnimationProducer';
import { insertCodeSnippet } from '../util/codeSnippets';
import GraphicalAVLNode from '../data-structure/GraphicalAVLNode';

export default class AVLAnimationProducer extends BSTInsertAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }

  public unhighlightNodeAndPointers(node: GraphicalAVLNode): void {
    this.unhighlightLine(node.leftLineTarget, node.leftArrowTarget);
    this.unhighlightLine(node.rightLineTarget, node.rightArrowTarget);
    this.unhighlightNode(node);
  }
}
