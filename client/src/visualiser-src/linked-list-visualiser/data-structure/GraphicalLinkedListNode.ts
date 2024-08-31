import { SVG, Path, Text, Circle, Svg, Marker } from '@svgdotjs/svg.js';
import {
  shapeAttributes,
  textAttributes,
  pathAttributes,
  topOffset,
  nodePathWidth,
} from '../util/constants';
import { getPointerPath } from '../util/util';
import { actualNodeDiameter, markerLength, pathD, VISUALISER_CANVAS } from '../../common/constants';

function addMarker(this: Path, add: Marker) {
  add.path(pathD);
  this.attr('markerUnits', 'userSpaceOnUse');
}
interface SVGData {
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

  private _next: GraphicalLinkedListNode | null;

  private constructor(data: GraphicalLinkedListNodeData) {
    this._data = data;
    this._next = null;
  }

  public static newHeadPointer() {
    SVG()
      .text('head')
      .attr(textAttributes)
      .opacity(1)
      .attr({ 'font-size': 16, 'font-family': 'CodeText' })
      .addTo(VISUALISER_CANVAS);
    const headPointer = SVG()
      .path()
      .attr(pathAttributes)
      .opacity(0)
      .plot(
        getPointerPath(
          actualNodeDiameter / 2,
          topOffset,
          actualNodeDiameter / 2 + nodePathWidth,
          topOffset
        )
      )
      .addTo(VISUALISER_CANVAS);

    headPointer.marker('end', markerLength, markerLength, addMarker);
    return headPointer;
  }

  public static from(input: number) {
    const canvas = SVG(VISUALISER_CANVAS) as Svg;
    const newPointer = canvas.path().attr(pathAttributes);
    const nodeShape = canvas.circle().attr(shapeAttributes);
    const nodeValue = canvas.text(String(input)).attr(textAttributes);
    newPointer.marker('end', markerLength, markerLength, addMarker);
    return new GraphicalLinkedListNode({
      value: input,
      svgData: {
        numberTarget: nodeValue,
        boxTarget: nodeShape,
        pointerTarget: newPointer,
      },
    });
  }

  public get data() {
    return this._data;
  }

  public get next(): GraphicalLinkedListNode | null {
    return this._next;
  }

  public set next(next: GraphicalLinkedListNode | null) {
    this._next = next;
  }

  public get value() {
    return this._data.value;
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

  public get x(): number {
    return this.boxTarget.attr('cx');
  }

  public get y(): number {
    return this.boxTarget.attr('cy');
  }
}
