import { SVG, Text, Rect, Svg } from '@svgdotjs/svg.js';
import { VISUALISER_CANVAS } from 'visualiser-src/common/constants';
import { shapeAttributes, textAttributes, boxWidth } from '../util/constants';
import { getX, getY } from '../util/helpers';

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

  public static pointer(index: number, colour: string) {
    const pointer = SVG()
      .polygon('5, 15, 15, 15, 10, 0').fill({ color: colour })
      .addTo(VISUALISER_CANVAS)

    pointer.x(getX(index) + boxWidth / 2 - 5).y(getY(index) + 25);

    pointer.opacity(0);
    return pointer;
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
