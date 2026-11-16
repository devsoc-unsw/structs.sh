import { deleteEdgeCodeSnippet } from '../util/codeSnippets';
import GraphAnimationProducer from './GraphAnimationProducer';

// Class that produces SVG.Runners animating graph operations specific to deleting an edge
export default class GraphDeleteEdgeAnimationProducer extends GraphAnimationProducer {
  /**
   * Shows the C code for deleting an edge in the code panel.
   * @returns nothing
   */
  public renderDeleteEdgeCode(): void {
    this.renderCode(deleteEdgeCodeSnippet);
  }
}
