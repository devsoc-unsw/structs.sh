import { Circle, Marker, Path } from '@svgdotjs/svg.js';
import { EDGE_FILL, EDGE_WIDTH, STROKE_WIDTH } from 'visualiser-src/common/constants';
import AnimationProducer from '../../common/AnimationProducer';

export default class GraphAnimationProducer extends AnimationProducer {
  public highlightVertex(vertex: Circle): void {
    // TODO: move hex codes in this file to a constants file.
    this.addSequenceAnimation(vertex.animate().attr({ fill: '#dbff27' }));
  }

  public highlightEdge(edge: Path, startArrowhead: Path, endArrowhead: Path): void {
    this.addSequenceAnimation(
      edge.animate().attr({
        stroke: '#00008B',
        'stroke-width': '10px',
      })
    );
    this.addSequenceAnimation(
      endArrowhead.animate().attr({
        fill: '#00008B',
      })
    );
    this.addSequenceAnimation(
      startArrowhead.animate().attr({
        fill: '#00008B',
      })
    );
  }

  public unhighlightVertex(vertex: Circle): void {
    this.addSequenceAnimation(
      vertex.animate().attr({
        fill: '#FFFFFF',
      })
    );
  }

  public unhighlightEdge(edge: Path, startArrowhead: Path, endArrowhead: Path): void {
    this.addSequenceAnimation(
      edge.animate().attr({
        stroke: EDGE_FILL,
        'stroke-width': EDGE_WIDTH,
      })
    );
    this.addSequenceAnimation(
      endArrowhead.animate().attr({
        fill: EDGE_FILL,
      })
    );
    this.addSequenceAnimation(
      startArrowhead.animate().attr({
        fill: EDGE_FILL,
      })
    );
  }

  public unhighlightAllVerticesAndEdges(edges: [Path, Path, Path][], vertices: Circle[]) {
    vertices.forEach((vertex) => {
      this.unhighlightVertex(vertex);
    });
    edges.forEach((edge) => {
      const [line, startArrowhead, endArrowhead] = edge;
      this.unhighlightEdge(line, startArrowhead, endArrowhead);
    });
  }
}
