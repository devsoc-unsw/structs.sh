import LinkedListAnimationProducer from './LinkedListAnimationProducer';
import { appendCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating linked list operations specific to appending
export default class LinkedListAppendAnimationProducer extends LinkedListAnimationProducer {
  public renderAppendCode() {
    this.renderCode(appendCodeSnippet);
  }
}
