import { Line, Marker } from '@svgdotjs/svg.js';
import { lineDiffY, canvasPadding } from '../../common/settings';
import { getPointerStartEndCoordinates } from '../../common/helpers';
import AnimationProducer from '../../common/AnimationProducer';
import GraphicalBSTNode from '../data-structure/GraphicalBSTNode';

export default class BSTAnimationProducer extends AnimationProducer {
  public highlightNode(node: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#39AF8E',
        stroke: '#39AF8E',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#ffffff',
      })
    );
  }

  public halfHighlightNode(node: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        stroke: '#39AF8E',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#39AF8E',
      })
    );
  }

  public halfHighlightNodeRed(node: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        stroke: '#AF3939',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#AF3939',
      })
    );
  }

  public highlightLine(lineTarget: Line, arrowTarget: Marker, create: boolean = false): void {
    if (lineTarget != null) {
      if (create) {
        // If line should be created and highlighted
        this.addSequenceAnimation(
          lineTarget.animate(500).attr({
            stroke: '#39AF8E',
            opacity: 1,
          })
        );

        this.addSequenceAnimation(
          arrowTarget.animate(500).attr({
            fill: '#39AF8E',
            opacity: 1,
          })
        );
      } else {
        // Line will not be highlighted if it doesn't already exist
        this.addSequenceAnimation(
          lineTarget.animate(500).attr({
            stroke: '#39AF8E',
          })
        );

        this.addSequenceAnimation(
          arrowTarget.animate(500).attr({
            fill: '#39AF8E',
          })
        );
      }
    }
  }

  public updateBST(root: GraphicalBSTNode): void {
    this.updateNodesRecursive(root);
    this.updateLinesRecursive(root);
  }

  public updateNodesRecursive(node: GraphicalBSTNode | null): void {
    if (node === null) {
      return;
    }

    this.updateNode(node, node.x, node.y);
    this.updateNodesRecursive(node.left);
    this.updateNodesRecursive(node.right);
  }

  public updateNode(node: GraphicalBSTNode, newX: number, newY: number): void {
    this.addSequenceAnimation(node.nodeTarget.animate(400).cx(newX).cy(newY));

    this.addSequenceAnimation(node.textTarget.animate(400).cx(newX).cy(newY));
  }

  public updateLinesRecursive(node: GraphicalBSTNode | null): void {
    if (node === null) {
      return;
    }

    this.updateNodeLines(node);
    this.updateLinesRecursive(node.left);
    this.updateLinesRecursive(node.right);
  }

  public updateNodeLines(node: GraphicalBSTNode): void {
    const lineDiffX = BSTAnimationProducer.getLineDiffX(node);

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
  public static getLineDiffX(node: GraphicalBSTNode): number {
    const canvasWidth = document.getElementById('visualiser-container')!.offsetWidth;
    const depth: number = (node.y - canvasPadding) / 75;
    const baseDiff = canvasWidth / 4;

    return baseDiff / 2 ** depth;
  }

  public unhighlightBST(root: GraphicalBSTNode): void {
    this.unhighlightLinesRecursive(root);
    this.unhighlightNodesRecursive(root);
  }

  public unhighlightLinesRecursive(node: GraphicalBSTNode | null): void {
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
    }
  }

  public unhighlightNodesRecursive(node: GraphicalBSTNode | null): void {
    if (node === null) {
      return;
    }

    this.unhighlightNode(node);
    this.unhighlightNodesRecursive(node.left);
    this.unhighlightNodesRecursive(node.right);
  }

  public updateAndUnhighlightBST(root: GraphicalBSTNode): void {
    this.updateNodesRecursive(root);
    this.updateLinesRecursive(root);
    this.unhighlightLinesRecursive(root);
    this.unhighlightNodesRecursive(root);
  }

  public unhighlightNode(node: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      node.nodeTarget.animate(500).attr({
        fill: '#EBE8F4',
        stroke: '#000000',
      })
    );

    this.addSequenceAnimation(
      node.textTarget.animate(500).attr({
        fill: '#000000',
      })
    );
  }

  public movePointerToNewRootRightChild(
    oldRoot: GraphicalBSTNode,
    newRoot: GraphicalBSTNode
  ): void {
    this.addSequenceAnimation(
      oldRoot.leftLineTarget
        .animate(400)
        .plot(
          getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.right!.x, newRoot.right!.y)
        )
    );
  }

  public movePointerToNewRootLeftChild(oldRoot: GraphicalBSTNode, newRoot: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      oldRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(oldRoot.x, oldRoot.y, newRoot.left!.x, newRoot.left!.y))
    );
  }

  public moveRightPointerToOldRoot(oldRoot: GraphicalBSTNode, newRoot: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      newRoot.rightLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
  }

  public moveLeftPointerToOldRoot(oldRoot: GraphicalBSTNode, newRoot: GraphicalBSTNode): void {
    this.addSequenceAnimation(
      newRoot.leftLineTarget
        .animate(400)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
  }

  public hideLine(line: Line): void {
    this.addSequenceAnimation(
      line.animate(400).attr({
        opacity: 0,
      })
    );
  }

  public showLine(line: Line): void {
    this.addSequenceAnimation(
      line.animate(400).attr({
        opacity: 1,
      })
    );
  }

  public assignNewRootRightPointerToOldRoot(
    oldRoot: GraphicalBSTNode,
    newRoot: GraphicalBSTNode
  ): void {
    this.addSequenceAnimation(
      newRoot.rightLineTarget
        .animate(1)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
    this.finishSequence(false);
    this.showLine(newRoot.rightLineTarget);
  }

  public assignNewRootLeftPointerToOldRoot(
    oldRoot: GraphicalBSTNode,
    newRoot: GraphicalBSTNode
  ): void {
    this.addSequenceAnimation(
      newRoot.leftLineTarget
        .animate(1)
        .plot(getPointerStartEndCoordinates(newRoot.x, newRoot.y, oldRoot.x, oldRoot.y))
    );
    this.finishSequence(false);
    this.showLine(newRoot.leftLineTarget);
  }
}
