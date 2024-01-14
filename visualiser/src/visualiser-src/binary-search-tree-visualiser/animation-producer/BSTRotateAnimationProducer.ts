import BSTAnimationProducer from './BSTAnimationProducer';
import { rotateLeftCodeSnippet, rotateRightCodeSnippet } from '../util/codeSnippets';

export default class BSTRotateAnimationProducer extends BSTAnimationProducer {
  public renderRotateLeftCode(): void {
    this.renderCode(rotateLeftCodeSnippet);
  }

  public renderRotateRightCode(): void {
    this.renderCode(rotateRightCodeSnippet);
  }
}
