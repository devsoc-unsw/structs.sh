import BSTInsertAnimationProducer from '@/visualiser-src/binary-search-tree-visualiser/animation-producer/BSTInsertAnimationProducer';
import {
  insertCodeSnippet,
  deleteCodeSnippet,
} from '@/visualiser-src/avl-tree-visualiser/util/codeSnippets';
import GraphicalAVLNode from '@/visualiser-src/avl-tree-visualiser/data-structure/GraphicalAVLNode';

export default class AVLAnimationProducer extends BSTInsertAnimationProducer {
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }

  public renderDeleteCode(): void {
    this.renderCode(deleteCodeSnippet);
  }

  public unhighlightNodeAndPointers(node: GraphicalAVLNode): void {
    this.unhighlightLine(node.leftLineTarget, node.leftArrowTarget);
    this.unhighlightLine(node.rightLineTarget, node.rightArrowTarget);
    this.unhighlightNode(node);
  }
}
