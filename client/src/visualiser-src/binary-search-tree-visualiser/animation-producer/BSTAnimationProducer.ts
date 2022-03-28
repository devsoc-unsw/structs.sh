import { Runner, Container, Line, Marker, Text } from '@svgdotjs/svg.js';
import { Node } from '../util/typedefs';
import { canvasPadding, nodeWidth } from '../util/settings';
import { getPointerStartEndCoordinates } from '../util/util';
import AnimationProducer from '../../common/AnimationProducer';

export default class BSTAnimationProducer extends AnimationProducer {
  public visualiserCanvas: Container;
  public codeCanvas: Container;

  // TODO: move to AnimationProducer later
  private _codeTargets: Text[] = [];

  // TODO: change bst lines to be pointers instead

  public get codeTargets() {
    return this._codeTargets;
  }

  // the problem with each BSTAnimationProducer having its own visualiser canvas created
  // is that svg.js uses an addTo method which would create an extra svg container
  // of max width and height. we don't want this
  public constructor(visualiserCanvas: Container, codeCanvas: Container) {
    super();
    this.visualiserCanvas = visualiserCanvas;
    this.codeCanvas = codeCanvas;
  }

  public renderCode(code: string): void {
    const lines: string[] = code.split('\n');

    lines.forEach((line, i) => {
      this.codeTargets.push(
        this.codeCanvas.text(line)
        .font('family', 'CodeText')
        .attr('style','white-space: pre-wrap')
        .move(0, 22 * i)
      );
    })
  }

  // public highlightCodeLine(line: number): Runner {
  //   return this.codeTargets[line].animate(500).attr({
  //     fill: '#4beb9b',
  //   })
  // }

  // public highlightCodeLine(line: number): Runner {
  //   return this.codeTargets[line].animate(500).attr({
  //     fill: '#4beb9b',
  //   })
  // }

  public halfHighlightNode(node: Node): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        stroke: '#4beb9b',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#4beb9b',
      })
    );

    this.finishSequence();
  }

  public highlightLine(lineTarget: Line, arrowTarget: Marker): void {
    if (lineTarget != null) {
      this.addSequenceAnimation(
        lineTarget.animate(500).attr({
          stroke: '#4beb9b',
        }),
      );
      
      this.addSequenceAnimation(
        arrowTarget.animate(500).attr({
          fill: '#4beb9b',
        })
      );

      this.finishSequence();
    }
  }

  public updateBST(root: Node): void {
    this.updateNodesRecursive(root);
    this.updateLinesRecursive(root);
    this.finishSequence();
  }

  public updateNodesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.updateNode(node, node.x, node.y);
    this.updateNodesRecursive(node.left);
    this.updateNodesRecursive(node.right);
  }

  public updateNode(node: Node, newX: number, newY: number): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(400).cx(newX).cy(newY)
    );

    this.addSequenceAnimation(
      node.textTarget.animate(400).cx(newX).cy(newY)
    );
  }

  public updateLinesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.updateNodeLines(node);
    this.updateLinesRecursive(node.left);
    this.updateLinesRecursive(node.right);
  }

  public updateNodeLines(node: Node): void {
    const lineDiffX = BSTAnimationProducer.getLineDiffX(node);
    const lineDiffY = 75;

    this.addSequenceAnimation(
      node.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(node.x, node.y, node.x - lineDiffX, node.y + lineDiffY))
    );

    this.addSequenceAnimation(
      node.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(node.x, node.y, node.x + lineDiffX, node.y + lineDiffY))
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
    this.resetLinesRecursive(root);
    this.resetNodesRecursive(root);
    this.finishSequence();
  }

  public resetLinesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.unhighlightLine(node.leftLineTarget, node.leftArrowTarget);
    this.unhighlightLine(node.rightLineTarget, node.rightArrowTarget);
    this.resetLinesRecursive(node.left);
    this.resetLinesRecursive(node.right);
  }

  public unhighlightLine(lineTarget: Line, arrowTarget: Marker): void {
    if (lineTarget != null) {
      this.addSequenceAnimation(
        lineTarget.animate(500).attr({
          stroke: '#000000',
        })
      );

      this.addSequenceAnimation(
        arrowTarget.animate(500).attr({
          fill: '#000000',
        })
      );
    }
  }

  public resetNodesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.unhighlightNode(node);
    this.resetNodesRecursive(node.left);
    this.resetNodesRecursive(node.right);
  }

  public unhighlightNode(node: Node): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#ffffff',
        stroke: '#000000',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#000000',
      })
    );
  }
}
