import { Circle, CircleMethods, Marker, Path, Text } from '@svgdotjs/svg.js';
import {
  EDGE_FILL,
  EDGE_WIDTH,
  STROKE_WIDTH,
  VERTEX_FILL,
  VERTEX_STROKE,
} from 'visualiser-src/common/constants';
import AnimationProducer from '../../common/AnimationProducer';

export default class GraphAnimationProducer extends AnimationProducer {
  public highlightVertex(vertex: Circle, vertexText: Text): void {
    this.addSequenceAnimation(
      vertex.animate().attr({ stroke: '#39AF8E', 'stroke-width': '4px', fill: '#48dbb2' })
    );
    this.addSequenceAnimation(vertexText.animate().attr({ fill: '#FFFFFF' }));
  }

  public highlightEdge(edge: Path, startArrowhead: Path, endArrowhead: Path): void {
    this.addSequenceAnimation(
      edge.animate().attr({
        'stroke-width': '6px',
        stroke: '#39AF8E',
      })
    );
    this.addSequenceAnimation(
      endArrowhead.animate().attr({
        stroke: '#39AF8E',
        fill: '#39AF8E',
      })
    );
    this.addSequenceAnimation(
      startArrowhead.animate().attr({
        stroke: '#39AF8E',
        fill: '#39AF8E',
      })
    );
  }

  public unhighlightVertex(vertex: CircleMethods, vertexText: Text): void {
    this.addSequenceAnimation(
      vertex.animate().attr({
        stroke: VERTEX_STROKE,
        'stroke-width': STROKE_WIDTH,
        fill: VERTEX_FILL,
      })
    );

    this.addSequenceAnimation(
      vertexText.animate().attr({
        fill: '#000000',
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
        stroke: EDGE_FILL,
      })
    );
    this.addSequenceAnimation(
      startArrowhead.animate().attr({
        fill: EDGE_FILL,
        stroke: EDGE_FILL,
      })
    );
  }

  public unhighlightAllVerticesAndEdges(edges: [Path, Path, Path][], vertices: [Circle, Text][]) {
    vertices.forEach((vertex) => {
      const [circle, text] = vertex;
      this.unhighlightVertex(circle, text);
    });
    edges.forEach((edge) => {
      const [line, startArrowhead, endArrowhead] = edge;
      this.unhighlightEdge(line, startArrowhead, endArrowhead);
    });
  }
}
