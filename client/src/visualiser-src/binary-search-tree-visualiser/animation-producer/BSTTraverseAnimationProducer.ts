import BSTAnimationProducer from './BSTAnimationProducer';
import {
  inorderTraversalCodeSnippet,
  preorderTraversalCodeSnippet,
  postorderTraversalCodeSnippet,
} from '../util/codeSnippets';
import GraphicalBSTNode from '../data-structure/GraphicalBSTNode';

export default class BSTTraverseAnimationProducer extends BSTAnimationProducer {
  public renderInorderTraversalCode(): void {
    this.renderCode(inorderTraversalCodeSnippet);
  }

  public renderPreorderTraversalCode(): void {
    this.renderCode(preorderTraversalCodeSnippet);
  }

  public renderPostorderTraversalCode(): void {
    this.renderCode(postorderTraversalCodeSnippet);
  }
}
