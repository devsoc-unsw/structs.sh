import { SVG } from '@svgdotjs/svg.js';
import { Node, Animation } from '../util/typedefs';
import { nodeSettings } from '../util/settings';

// this class is used for:
// . creation of bst nodes
// . providing functions which perform specific animations
// . storing the main svg called draw
export class BSTAnimationProducer {
  private draw = SVG().addTo('#bst-canvas').size('100%', '100%');

  // draws a node which is composed of svgs and adds svg references to
  // the node
  // TODO: remove hardcoded value of 50
  public createNode(node: Node) {
    if (node.parent != null) {
      node.lineTarget = this.draw
        .line(node.parent.x, node.parent.y, node.x, node.y + 50)
        .attr({ opacity: 0 });
      node.lineTarget.stroke({
        color: '#000',
        width: 3,
        linecap: 'round',
      });

      node.lineTarget.back();
    }

    // create a g element and add the text and circle elements to it
    node.nodeTarget = this.draw.circle(nodeSettings.width);
    node.nodeTarget.attr({
      fill: nodeSettings.fillColour,
      cx: node.x,
      cy: node.y + 50,
      stroke: '#000',
      'stroke-width': 3,
      opacity: 0,
    });

    node.textTarget = this.draw.text(node.value.toString());
    node.textTarget.attr({
      'dominant-baseline': 'middle',
      'text-anchor': 'middle',
      x: node.x,
      y: node.y + 50,
      opacity: 0,
    });
  }

  public highlightNode(node: Node, animationSequence: Animation[]) {
    animationSequence.push({
      targets: [node.nodeTarget],
      duration: 400,
      delay: 200,
      simultaneous: false,
      attrs: {
        fill: '#00ff00',
      },
    });

    animationSequence.push({
      targets: [node.nodeTarget],
      duration: 400,
      delay: 200,
      simultaneous: false,
      attrs: {
        fill: '#ffffff',
      },
    });
  }

  public showNode(node: Node, animationSequence: Animation[]) {
    animationSequence.push({
      targets: [node.nodeTarget, node.textTarget],
      duration: 400,
      delay: 0,
      simultaneous: false,
      attrs: {
        opacity: 1,
      },
    });
  }

  public moveNode(node: Node, newX: number, newY: number, animationSequence: Animation[]) {
    animationSequence.push({
      targets: [node.nodeTarget, node.textTarget],
      duration: 400,
      delay: 0,
      simultaneous: true,
      attrs: {
        x: newX,
        y: newY,
        cx: newX,
        cy: newY,
      },
    });
  }
}
