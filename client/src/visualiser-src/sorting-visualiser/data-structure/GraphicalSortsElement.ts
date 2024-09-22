import { SVG, Text, Rect, Svg, Polygon } from '@svgdotjs/svg.js';
import { VISUALISER_CANVAS_ID } from 'visualiser-src/common/constants';
import { shapeAttributes, textAttributes, boxWidth, textCy } from '../util/constants';
import { getX } from '../util/helpers';

interface SVGData {
  boxTarget: Rect;
  numberTarget: Text;
}

interface GraphicalSortsElementData {
  value: number;
  displayValue: string;
  svgData: SVGData;
}

export default class GraphicalSortsElement {
  public data: GraphicalSortsElementData;

  private constructor(data: GraphicalSortsElementData) {
    this.data = data;
  }

  public static pointer(index: number, colour: string): Polygon {
    const pointer = SVG()
      .polygon('5, 15, 15, 15, 10, 0')
      .fill({ color: colour })
      .addTo(`#${VISUALISER_CANVAS_ID}`);

    pointer.x(getX(index) + boxWidth / 2 - 5).y(textCy + 15);

    pointer.opacity(0);
    return pointer;
  }

  public static from(input: number, displayInput: string) {
    const canvas = SVG(`#${VISUALISER_CANVAS_ID}`) as Svg;
    const blockShape = canvas
      .rect()
      .attr(shapeAttributes)
      .width(boxWidth)
      .height(Math.sqrt(input * 90));
    const elementValue = canvas.text(String(displayInput)).attr(textAttributes);
    return new GraphicalSortsElement({
      value: input,
      displayValue: displayInput,
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
