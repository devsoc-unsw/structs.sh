import { dfsCodeSnippet } from '../util/codeSnippets';
import GraphAnimationProducer from './GraphAnimationProducer';

export default class GraphDfsAnimationProducer extends GraphAnimationProducer {
  public renderDfsCode() {
    this.renderCode(dfsCodeSnippet);
  }
}
