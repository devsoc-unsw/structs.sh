import { Path, SVG } from '@svgdotjs/svg.js';

export class Edge {
  public source: string;

  public target: string;

  public weight: number;

  public isBidirectional: boolean;

  private constructor(source: string, target: string, weight: number, isBidirectional: boolean) {
    this.source = source;
    this.target = target;
    this.weight = weight;
    this.isBidirectional = isBidirectional;
  }

  public static from(source: number, target: number, weight: number, isBidirectional: boolean) {
    return new Edge(String(source), String(target), weight, isBidirectional);
  }

  public static getDomReference(source: number, target: number): Path {
    return SVG(`.edge-${source}-${target}`) as Path;
  }
}
