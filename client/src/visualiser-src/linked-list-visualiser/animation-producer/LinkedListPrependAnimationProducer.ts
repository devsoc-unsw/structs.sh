import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { prependCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating linked list operations specific to prepending
export default class LinkedListPrependAnimationProducer extends LinkedListAnimationProducer {
  public renderPrependCode() {
    this.renderCode(prependCodeSnippet);
  }
}
