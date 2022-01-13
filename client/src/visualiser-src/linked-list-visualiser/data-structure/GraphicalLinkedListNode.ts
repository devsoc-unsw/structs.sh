import { setAttributes } from '../util/utils';
import {
  nodeAttributes, shapeAttributes, textAttributes, pathAttributes,
} from '../util/constants';

const SVG = 'http://www.w3.org/2000/svg';

interface SVGData {
  nodeTarget: SVGSVGElement;
  pointerTarget: SVGPathElement;
  boxTarget: SVGGElement;
  numberTarget: SVGTextElement;
}

interface GraphicalLinkedListNodeData {
  value: number;
  svgData: SVGData;
}

export class GraphicalLinkedListNode {
  private _data: GraphicalLinkedListNodeData;

  private _next: GraphicalLinkedListNode;

  private constructor(data: GraphicalLinkedListNodeData) {
    this._data = data;
    this._next = null;
  }

  public static from(input: number) {
    // Create SVG node
    const newNode = document.createElementNS(SVG, 'svg');
    // Node Box + Value group
    const nodeBox = document.createElementNS(SVG, 'g');
    // Box for node
    const nodeShape = document.createElementNS(SVG, 'rect');
    // Text inside node
    const nodeValue = document.createElementNS(SVG, 'text');
    nodeValue.innerHTML = input.toString();
    // Pointer for node
    const newPointer = document.createElementNS(SVG, 'path');

    setAttributes(newNode, nodeAttributes);
    setAttributes(nodeShape, shapeAttributes);
    setAttributes(nodeValue, textAttributes);
    setAttributes(newPointer, pathAttributes);

    // Attach all the elements together
    nodeBox.appendChild(nodeShape);
    nodeBox.appendChild(nodeValue);
    newNode.appendChild(nodeBox);
    newNode.appendChild(newPointer);

    return new GraphicalLinkedListNode(
      {
        value: input,
        svgData: {
          numberTarget: nodeValue,
          boxTarget: nodeShape,
          nodeTarget: newNode,
          pointerTarget: newPointer,
        },
      },
    );
  }

  public get data() {
    return this._data;
  }

  public get next() {
    return this._next;
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

  public set next(next: GraphicalLinkedListNode) {
    this._next = next;
  }
}
