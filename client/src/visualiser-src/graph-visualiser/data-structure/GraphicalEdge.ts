import { Path, SVG } from '@svgdotjs/svg.js';
import { GraphicalVertex } from './GraphicalVertex';

export class GraphicalEdge {
  private _source: GraphicalVertex;

  private _target: GraphicalVertex;

  private _weight: number;

  private _isBidirectional: boolean;

  private constructor(
    source: GraphicalVertex,
    target: GraphicalVertex,
    weight: number,
    isBidirectional: boolean
  ) {
    this._source = source;
    this._target = target;
    this._weight = weight;
    this._isBidirectional = isBidirectional;
  }

  public static from(
    source: GraphicalVertex,
    target: GraphicalVertex,
    weight: number,
    isBidirectional: boolean = false
  ) {
    return new GraphicalEdge(source, target, weight, isBidirectional);
  }

  public getReference(): Path {
    return SVG(`.edge-${this.source.id}-${this.target.id}`) as Path;
  }

  public get source() {
    return this._source;
  }

  public get target() {
    return this._target;
  }

  public get weight() {
    return this._weight;
  }

  public get isBidirectional() {
    return this._isBidirectional;
  }
}
