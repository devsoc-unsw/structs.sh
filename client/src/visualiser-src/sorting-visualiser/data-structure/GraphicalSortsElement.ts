import { SVG, Text, Rect, Svg } from '@svgdotjs/svg.js';
import { VISUALISER_CANVAS } from 'visualiser-src/common/constants';
import { shapeAttributes, textAttributes, boxWidth } from '../util/constants';

interface SVGData {
  boxTarget: Rect;
  numberTarget: Text;
}

interface GraphicalSortsElementData {
  value: number;
  svgData: SVGData;
}

export default class GraphicalSortsElement {
  public data: GraphicalSortsElementData;

  private constructor(data: GraphicalSortsElementData) {
    this.data = data;
  }

  public static from(input: number) {
    const canvas = SVG(VISUALISER_CANVAS) as Svg;
    const blockShape = canvas
      .rect()
      .attr(shapeAttributes)
      .width(boxWidth)
      .height(Math.sqrt(input * 90));
    const elementValue = canvas.text(String(input)).attr(textAttributes);
    return new GraphicalSortsElement({
      value: input,
      svgData: {
        numberTarget: elementValue,
        boxTarget: blockShape,
      },
    });
  }

  public get boxTarget() {
    return this.data.svgData.boxTarget;
  }

  public get numberTarget() {
    return this.data.svgData.numberTarget;
  }
}
