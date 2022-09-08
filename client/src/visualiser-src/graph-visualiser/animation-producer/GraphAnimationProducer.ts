import { Circle, Path } from '@svgdotjs/svg.js';
import AnimationProducer from '../../common/AnimationProducer';

export default class GraphAnimationProducer extends AnimationProducer {
  public highlightVertex(vertex: Circle): void {
    this.addSequenceAnimation(vertex.animate().attr({ fill: '#dbff27' }));
  }

  public highlightEdge(edge: Path): void {
    this.addSequenceAnimation(
      edge.animate().attr({
        stroke: '#0000FF',
      })
    );
  }
}
