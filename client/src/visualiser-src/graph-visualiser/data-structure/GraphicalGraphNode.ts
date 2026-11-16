import { Svg, Circle, Text } from '@svgdotjs/svg.js';
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

  /**
   * Makes the invisible circle and label for one vertex.
   * @param index -- the vertex number
   * @param layer -- the SVG layer to draw into
   * @returns the new vertex drawing
   */
  public static from(index: number, layer: Svg): GraphicalGraphNode {
    const circle = layer.circle().attr(shapeAttributes);
    const label = layer.text(String(index)).attr(textAttributes);
    return new GraphicalGraphNode(index, circle, label);
  }

  public get boxTarget(): Circle {
    return this.circle;
  }

  public get numberTarget(): Text {
    return this.label;
  }
}
