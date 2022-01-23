import {
  SVG, Path, Text, Rect, Svg,
} from '@svgdotjs/svg.js';
import {
  nodeAttributes,
  shapeAttributes,
  textAttributes,
  pathAttributes,
  RIGHT_ARROW_PATH,
} from '../util/constants';

interface SVGData {
  nodeTarget: Svg;
  pointerTarget: Path;
  boxTarget: Rect;
  numberTarget: Text;
}

interface GraphicalLinkedListNodeData {
  value: number;
  svgData: SVGData;
}

export default class GraphicalLinkedListNode {
  private _data: GraphicalLinkedListNodeData;

  private _next: GraphicalLinkedListNode;

  private constructor(data: GraphicalLinkedListNodeData) {
    this._data = data;
    this._next = null;
  }

  public static from(input: number) {
    const newNode = SVG().attr(nodeAttributes);
    const nodeShape = newNode.rect().attr(shapeAttributes);
    const nodeValue = newNode.text(String(input)).attr(textAttributes);
    const newPointer = newNode.path().attr(pathAttributes).plot(RIGHT_ARROW_PATH);
    return new GraphicalLinkedListNode({
      value: input,
      svgData: {
        numberTarget: nodeValue,
        boxTarget: nodeShape,
        nodeTarget: newNode,
        pointerTarget: newPointer,
      },
    });
  }

  public get data() {
    return this._data;
  }

  public get next() {
    return this._next;
  }

  public set next(next: GraphicalLinkedListNode) {
    this._next = next;
  }

  public get value() {
    return this._data.value;
  }

  public get nodeTarget() {
    return this._data.svgData.nodeTarget;
  }

  public get pointerTarget() {
    return this._data.svgData.pointerTarget;
  }

  public get boxTarget() {
    return this._data.svgData.boxTarget;
  }

  public get numberTarget() {
    return this._data.svgData.numberTarget;
  }
}
