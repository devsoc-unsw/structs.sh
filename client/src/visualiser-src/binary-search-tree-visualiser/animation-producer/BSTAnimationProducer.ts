import { Runner, Container, Line } from '@svgdotjs/svg.js';
import { Node } from '../util/typedefs';
import { canvasPadding } from '../util/settings';
import AnimationProducer from '../../common/AnimationProducer';

export default class BSTAnimationProducer extends AnimationProducer {
  public draw: Container;

  // the problem with each BSTAnimationProducer having its own draw canvas created
  // is that svg.js uses an addTo method which would create an extra svg container
  // of max width and height. we don't want this
  public constructor(draw: Container) {
    super();
    this.draw = draw;
  }

  public flashNode(node: Node): void {
    this.allRunners.push([
      node.nodeTarget
        .animate(500)
        .attr({
          fill: '#4beb9b',
          stroke: '#4beb9b',
        }),
      node.textTarget
        .animate(500)
        .attr({
          fill: '#ffffff',
        }),
    ]);

    this.allRunners.push([
      node.nodeTarget
        .animate(500)
        .attr({
          fill: '#ffffff',
          stroke: '#000000',
        }),
      node.textTarget
        .animate(500)
        .attr({
          fill: '#000000',
        }),
    ]);
  }

  public updateBST(root: Node): void {
    const animation: Runner[] = [];
    this.updateNodesRecursive(root, animation);
    this.updateLinesRecursive(root, animation);
    this.allRunners.push(animation);
  }

  public updateNodesRecursive(node: Node, animation: Runner[]): void {
    if (node === null) {
      return;
    }

    BSTAnimationProducer.updateNode(node, node.x, node.y, animation);
    this.updateNodesRecursive(node.left, animation);
    this.updateNodesRecursive(node.right, animation);
  }

  public static updateNode(node: Node, newX: number, newY: number, animation: Runner[]): void {
    animation.push(
      node.nodeTarget
        .animate(400)
        .cx(newX)
        .cy(newY),
    );

    animation.push(
      node.textTarget
        .animate(400)
        .cx(newX)
        .cy(newY),
    );
  }

  public updateLinesRecursive(node: Node, animation: Runner[]): void {
    if (node === null) {
      return;
    }

    BSTAnimationProducer.updateNodeLines(node, animation);
    this.updateLinesRecursive(node.left, animation);
    this.updateLinesRecursive(node.right, animation);
  }

  public static updateNodeLines(node: Node, animation: Runner[]): void {
    const lineDiffX = BSTAnimationProducer.getLineDiffX(node);
    const lineDiffY = 75;

    animation.push(
      node.leftLineTarget
        .animate(400)
        .plot([[node.x, node.y], [node.x - lineDiffX, node.y + lineDiffY]]),
    );

    animation.push(
      node.rightLineTarget
        .animate(400)
        .plot([[node.x, node.y], [node.x + lineDiffX, node.y + lineDiffY]]),
    );
  }

  // returns the difference in x coordinates with the node
  // and it's two child nodes
  public static getLineDiffX(node: Node): number {
    const canvasWidth = document.getElementById('bst-canvas').offsetWidth;
    const depth: number = (node.y - canvasPadding) / 75;
    const baseDiff = canvasWidth / 4;

    return baseDiff / 2 ** depth;
  }

  public resetBST(root: Node): void {
    const animation: Runner[] = [];
    this.resetLinesRecursive(root, animation);
    this.resetNodesRecursive(root, animation);
    this.allRunners.push(animation);
  }

  public resetLinesRecursive(node: Node, animation: Runner[]): void {
    if (node === null) {
      return;
    }

    BSTAnimationProducer.unhighlightLine(node.leftLineTarget, animation);
    BSTAnimationProducer.unhighlightLine(node.rightLineTarget, animation);
    this.resetLinesRecursive(node.left, animation);
    this.resetLinesRecursive(node.right, animation);
  }

  public static unhighlightLine(lineTarget: Line, animation: Runner[]): void {
    if (lineTarget != null) {
      animation.push(
        lineTarget
          .animate(500)
          .attr({
            stroke: '#000000',
          }),
      );
    }
  }

  public resetNodesRecursive(node: Node, animation: Runner[]): void {
    if (node === null) {
      return;
    }

    BSTAnimationProducer.unhighlightNode(node, animation);
    this.resetNodesRecursive(node.left, animation);
    this.resetNodesRecursive(node.right, animation);
  }

  public static unhighlightNode(node: Node, animation: Runner[]): void {
    animation.push(
      node.nodeTarget
        .animate(500)
        .attr({
          fill: '#ffffff',
          stroke: '#000000',
        }),
      node.textTarget
        .animate(500)
        .attr({
          fill: '#000000',
        }),
    );
  }
}
