import BSTAnimationProducer from './BSTAnimationProducer';
import { deleteCodeSnippet } from '../util/codeSnippets';

export default class BSTDeleteAnimationProducer extends BSTAnimationProducer {
  public renderDeleteCode(): void {
    this.renderCode(deleteCodeSnippet);
  }
}