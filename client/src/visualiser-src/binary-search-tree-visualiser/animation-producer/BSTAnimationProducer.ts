import { Container, Line, Marker } from '@svgdotjs/svg.js';
import { Node, CodeLine } from '../util/typedefs';
import { canvasPadding } from '../util/settings';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import AnimationProducer from '../../common/AnimationProducer';

// just a constant used for developer with matching lines to code
const SHOW_LINE_NUMBERS = true;

export default class BSTAnimationProducer extends AnimationProducer {
  public visualiserCanvas: Container;

  public codeCanvas: Container;

  // TODO: move to AnimationProducer later
  private codeTargets: CodeLine[] = [];

  private highlightedLines: number[] = [];

  // TODO: change bst lines to be pointers instead

  // the problem with each BSTAnimationProducer having its own visualiser canvas created
  // is that svg.js uses an addTo method which would create an extra svg container
  // of max width and height. we don't want this
  public constructor(visualiserCanvas: Container, codeCanvas: Container) {
    super();
    this.visualiserCanvas = visualiserCanvas;
    this.codeCanvas = codeCanvas;

    this.codeCanvas.clear();
  }

  public renderCode(code: string): void {
    const lines: string[] = code.split('\n');

    // TODO: find simple way to vertically center text in svg rectangle
    lines.forEach((line, i) => {
      const codeLine: CodeLine = {
        textTarget: this.codeCanvas
          .text(SHOW_LINE_NUMBERS ? String(i + 1).padEnd(4, ' ') + line : line)
          .font({ family: 'CodeText', size: 10 })
          .attr('style', 'white-space: pre-wrap')
          .move(0, 18 * i + 6),
        rectTarget: this.codeCanvas
          .rect(1000, 20)
          .move(0, 18 * i)
          .back()
          .fill('#ebebeb'),
      };

      this.codeTargets.push(codeLine);
    });
  }

  // with highlightCode and highlightCodeMultiple
  // we treat line numbers as starting from 1, so
  // substract 1 from each index
  public highlightCode(line: number): void {
    // unhighlight previously highlighted lines
    this.unhighlightCodeMultiple();

    this.addSequenceAnimation(
      this.codeTargets[line - 1].rectTarget.animate(1).attr({
        fill: '#4beb9b',
      })
    );

    this.highlightedLines = [line];

    this.finishSequence();
  }

  public highlightCodeMultiple(lines: number[]): void {
    // unhighlight previously highlighted lines
    this.unhighlightCodeMultiple();

    lines.forEach((line) => {
      this.addSequenceAnimation(
        this.codeTargets[line - 1].rectTarget.animate(1).attr({
          fill: '#4beb9b',
        })
      );
    });

    this.highlightedLines = lines;

    this.finishSequence();
  }

  public unhighlightCodeMultiple(): void {
    this.highlightedLines.forEach((line) => {
      this.addSequenceAnimation(
        this.codeTargets[line - 1].rectTarget.animate(1).attr({
          fill: '#ebebeb',
        })
      );
    });
  }

  // these 2 functions are used to "decorate" animation function so each animation function doesn't
  // have to do code highlighting itself or push an animation sequence itself, which gives us more flexibility.
  // - fn: specifies an animation function and gets executed
  // - args: allows us to pass a variable amount of arguments which then get passed as arguments
  // to fn
  public doAnimationAndHighlight(line: number, fn: any, ...args: any[]): void {
    fn.apply(this, [...args]);
    this.highlightCode(line);
  }

  public doAnimation(fn: any, ...args: any[]): void {
    fn.apply(this, [...args]);

    // make sure that the animation function finishes the sequence if it
    // produced simultaneous animations
    this.finishSequence();
  }

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
  }

  public highlightLine(lineTarget: Line, arrowTarget: Marker): void {
    if (lineTarget != null) {
      this.addSequenceAnimation(
        lineTarget.animate(500).attr({
          stroke: '#4beb9b',
        })
      );

      this.addSequenceAnimation(
        arrowTarget.animate(500).attr({
          fill: '#4beb9b',
        })
      );
    }
  }

  public updateBST(root: Node): void {
    this.updateNodesRecursive(root);
    this.updateLinesRecursive(root);
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
    this.addSequenceAnimation(node.nodeTarget.animate(400).cx(newX).cy(newY));

    this.addSequenceAnimation(node.textTarget.animate(400).cx(newX).cy(newY));
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

  public unhighlightBST(root: Node): void {
    this.unhighlightLinesRecursive(root);
    this.unhighlightNodesRecursive(root);
  }

  public unhighlightLinesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.unhighlightLine(node.leftLineTarget, node.leftArrowTarget);
    this.unhighlightLine(node.rightLineTarget, node.rightArrowTarget);
    this.unhighlightLinesRecursive(node.left);
    this.unhighlightLinesRecursive(node.right);
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

      this.addSequenceAnimation(
        arrowTarget.animate(500).attr({
          fill: '#000000',
        })
      );
    }
  }

  public unhighlightNodesRecursive(node: Node): void {
    if (node === null) {
      return;
    }

    this.unhighlightNode(node);
    this.unhighlightNodesRecursive(node.left);
    this.unhighlightNodesRecursive(node.right);
  }

  public updateAndUnhighlightBST(root: Node): void {
    this.updateNodesRecursive(root);
    this.updateLinesRecursive(root);
    this.unhighlightLinesRecursive(root);
    this.unhighlightNodesRecursive(root);
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
