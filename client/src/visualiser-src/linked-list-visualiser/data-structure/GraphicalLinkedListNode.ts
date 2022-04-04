import { SVG, Path, Text, Circle, Svg } from '@svgdotjs/svg.js';
import {
  nodeAttributes,
  shapeAttributes,
  textAttributes,
  pathAttributes,
  CANVAS,
} from '../util/constants';
import { getPointerPath, Style } from '../util/util';
import { markerLength, pathD } from '../../common/constants';

interface SVGData {
  nodeTarget: Svg;
  pointerTarget: Path;
  boxTarget: Circle;
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

  public static newHeadPointer() {
    SVG().text('head').attr(textAttributes).attr({ 'font-size': 16 }).addTo(CANVAS);
    const headPointer = SVG()
      .path()
      .attr(pathAttributes)
      .opacity(0)
      .plot(getPointerPath(Style.RIGHT))
      .addTo(CANVAS);
    headPointer.marker('end', markerLength, markerLength, function (add) {
      add.path(pathD);
      this.attr('markerUnits', 'userSpaceOnUse');
    });
    return headPointer;
  }

  public static from(input: number) {
    const newNode = SVG().attr(nodeAttributes);
    const nodeShape = newNode.circle().attr(shapeAttributes);
    const nodeValue = newNode.text(String(input)).attr(textAttributes);
    const newPointer = newNode.path().attr(pathAttributes).plot(getPointerPath(Style.RIGHT));
    newPointer.marker('end', markerLength, markerLength, function (add) {
      add.path(pathD);
      this.attr('markerUnits', 'userSpaceOnUse');
    });
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
