import GraphAnimationProducer from './GraphAnimationProducer';
import { addEdgeCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating graph operations specific to adding an edge
export default class GraphAddEdgeAnimationProducer extends GraphAnimationProducer {
  /**
   * Shows the C code for adding an edge in the code panel.
   * @returns nothing
   */
  public renderAddEdgeCode(): void {
    this.renderCode(addEdgeCodeSnippet);
  }
}
