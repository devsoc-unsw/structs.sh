import GraphAnimationProducer from './GraphAnimationProducer';
import { deleteCodeSnippet } from '../util/codeSnippets';

// Class that produces SVG.Runners animating graph operations specific to deleting a vertex
export default class GraphDeleteAnimationProducer extends GraphAnimationProducer {
  /**
   * Shows the C code for deleting a vertex in the code panel.
   * @returns nothing
   */
  public renderDeleteCode(): void {
    this.renderCode(deleteCodeSnippet);
  }
}
