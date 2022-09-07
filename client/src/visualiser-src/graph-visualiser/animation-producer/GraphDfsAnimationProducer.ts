import { dfsCodeSnippet } from '../util/codeSnippets';
import GraphAnimationProducer from './GraphAnimationProducer';

// Class that produces SVG.Runners animating linked list operations specific to appending
export default class GraphDfsAnimationProducer extends GraphAnimationProducer {
  public renderDfsCode() {
    this.renderCode(dfsCodeSnippet);
  }
}
