import GraphAnimationProducer from './GraphAnimationProducer';
import { insertCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating graph operations specific to inserting a vertex
export default class GraphInsertAnimationProducer extends GraphAnimationProducer {
  /**
   * Shows the C code for inserting a vertex in the code panel.
   * @returns nothing
   */
  public renderInsertCode(): void {
    this.renderCode(insertCodeSnippet);
  }
}
