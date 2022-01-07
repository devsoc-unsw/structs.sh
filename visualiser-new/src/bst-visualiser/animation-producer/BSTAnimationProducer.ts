import { Node } from '../util/typedefs';
import { SVG, Runner } from '@svgdotjs/svg.js'
import { nodeSettings } from '../util/settings';

// this class is used for:
// . creation of bst nodes
// . providing functions which perform specific animations
// . storing the main svg called draw
export class BSTAnimationProducer {
    private draw = SVG().addTo('body').size(1200, 600);

    // draws a node which is composed of svgs and adds svg references to
    // the node
    public createNode(node: Node) {
        if (node.parent != null) {
            node.lineTarget = this.draw.line(node.parent.x, node.parent.y + 50, node.x, node.y + 50).stroke({ width: 1 });
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
            "dominant-baseline": "middle",
            "text-anchor": "middle",
            x: node.x,
            y: node.y + 50,
            opacity: 0,
        });
    }

    public highlightNode(node: Node, animationSequence: Runner[]) {
        animationSequence.push(node.nodeTarget.animate(400, 200, 'after').attr({ fill: '#00ff00' }));
        animationSequence.push(node.nodeTarget.animate(400, 200, 'after').attr({ fill: '#ffffff' }));
    }

    public showNode(node: Node, animationSequence: Runner[]) {
        animationSequence.push(node.nodeTarget.animate(400, 0, 'after').attr({ opacity: 1 }));
        animationSequence.push(node.textTarget.animate(400, 0, 'after').attr({ opacity: 1 }));
    }
}