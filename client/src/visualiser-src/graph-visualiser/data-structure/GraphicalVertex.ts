import { Circle, Path, SVG, Text } from '@svgdotjs/svg.js';

export class GraphicalVertex {
  // Note: d3 expects this to be named exactly `id`.
  public id: string;

  private constructor(id: string) {
    this.id = id;
  }

  public static from(id: number) {
    return new GraphicalVertex(String(id));
  }

  public getReference(): Circle {
    return SVG(`#vertex-${this.id}`) as Circle;
  }

  public getTextReference(): Text {
    return SVG(`#text-${this.id}`) as Text;
  }
}
