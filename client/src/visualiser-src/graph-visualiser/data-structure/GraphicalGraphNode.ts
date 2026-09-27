import { VISUALISER_CANVAS } from '@/visualiser-src/common/constants';
import { SVG, Svg, Circle, Text } from '@svgdotjs/svg.js';
import { shapeAttributes, textAttributes } from '../util/constants';

export default class GraphicalGraphNode {
  /** Vertex ID */
  public readonly index: number;

  /** A public mutable flag */
  public placed: boolean;

  private circle: Circle;

  private label: Text;

  private constructor(index: number, circle: Circle, label: Text) {
    this.placed = false;
    this.index = index;
    this.circle = circle;
    this.label = label;
  }

  public static from(index: number): GraphicalGraphNode {
    const canvas = SVG(VISUALISER_CANVAS) as Svg;
    const circle = canvas.circle().attr(shapeAttributes);
    const label = canvas.text(String(index)).attr(textAttributes);
    return new GraphicalGraphNode(index, circle, label);
  }

  public get boxTarget(): Circle {
    return this.circle;
  }

  public get numberTarget(): Text {
    return this.label;
  }
}
