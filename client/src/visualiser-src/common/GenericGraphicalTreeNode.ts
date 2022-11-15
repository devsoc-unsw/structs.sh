import { SVG, Svg, Circle, Line, Marker, Text } from '@svgdotjs/svg.js';
import {
  MARKER_LENGTH,
  NODE_DIAMETER,
  PATH_D,
  VISUALISER_CANVAS,
} from 'visualiser-src/common/constants';
import { lineStyle, nodeStyle, textStyle } from './settings';

interface SVGData {
  nodeTarget: Circle;
  textTarget: Text;
  leftLineTarget: Line;
  rightLineTarget: Line;
  leftArrowTarget: Marker;
  rightArrowTarget: Marker;
}

interface GenericGraphicalTreeNodeData {
  svgData: SVGData;
  value: number;
  x: number;
  y: number;
}

export default class GenericGraphicalTreeNode {
  private _data: GenericGraphicalTreeNodeData;

  protected _left: GenericGraphicalTreeNode;

  protected _right: GenericGraphicalTreeNode;

  protected constructor(data: GenericGraphicalTreeNodeData) {
    this._data = data;
    this._left = null;
    this._right = null;
  }

  public static from(input: number): GenericGraphicalTreeNode {
    return new GenericGraphicalTreeNode(GenericGraphicalTreeNode.createData(input));
  }

  public get nodeTarget() {
    return this._data.svgData.nodeTarget;
  }

  public get textTarget() {
    return this._data.svgData.textTarget;
  }

  public get leftLineTarget() {
    return this._data.svgData.leftLineTarget;
  }

  public get rightLineTarget() {
    return this._data.svgData.rightLineTarget;
  }

  public get leftArrowTarget() {
    return this._data.svgData.leftArrowTarget;
  }

  public get rightArrowTarget() {
    return this._data.svgData.rightArrowTarget;
  }

  public get value() {
    return this._data.value;
  }

  public get x() {
    return this._data.x;
  }

  public set x(x: number) {
    this._data.x = x;
  }

  public get y() {
    return this._data.y;
  }

  public set y(y: number) {
    this._data.y = y;
  }

  public get left() {
    return this._left;
  }

  public set left(left: GenericGraphicalTreeNode) {
    this._left = left;
  }

  public get right() {
    return this._right;
  }

  public set right(right: GenericGraphicalTreeNode) {
    this._right = right;
  }

  protected static createData(input: number) {
    const canvas = SVG(VISUALISER_CANVAS) as Svg;
    const leftArrowTarget = canvas
      .marker(MARKER_LENGTH, MARKER_LENGTH, (add: Marker) => {
        add.path(PATH_D);
      })
      .attr('markerUnits', 'userSpaceOnUse');
    const rightArrowTarget = canvas
      .marker(MARKER_LENGTH, MARKER_LENGTH, (add: Marker) => {
        add.path(PATH_D);
      })
      .attr('markerUnits', 'userSpaceOnUse');
    const leftLineTarget = canvas.line().attr(lineStyle);
    leftLineTarget.marker('end', leftArrowTarget);
    const rightLineTarget = canvas.line().attr(lineStyle);
    rightLineTarget.marker('end', rightArrowTarget);
    const nodeTarget = canvas.circle(NODE_DIAMETER).attr(nodeStyle);
    const textTarget = canvas.text(String(input)).attr(textStyle);
    return {
      svgData: {
        nodeTarget,
        textTarget,
        leftLineTarget,
        rightLineTarget,
        leftArrowTarget,
        rightArrowTarget,
      },
      value: input,
      x: 0,
      y: 0,
    };
  }
}
