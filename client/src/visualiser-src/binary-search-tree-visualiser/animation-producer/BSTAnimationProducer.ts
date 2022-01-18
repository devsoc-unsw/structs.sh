import { Node, Animation } from '../util/typedefs';
import { SVG, Runner, Container } from '@svgdotjs/svg.js';
import { nodeStyle, nodeWidth, textStyle, lineStyle, canvasPadding } from '../util/settings';

export default class BSTAnimationProducer {
    private animationSequence: Runner[][];
    public draw: Container;

    public getAnimationSequence() {
        return this.animationSequence;
    }

    // the problem with each BSTAnimationProducer having its own draw canvas created
    // is that svg.js uses an addTo method which would create an extra svg container
    // of max width and height. we don't want this
    public constructor(draw: Container) {
        this.animationSequence = [];
        this.draw = draw;
    }

    // draws a node on the draw canvas and shows the node
    public createNode(node: Node) {
        // based on the depth of the node we are able to create left and right svg line targets
        const canvasWidth = document.getElementById('bst-canvas').offsetWidth;
        const depth: number = (node.y - canvasPadding) / 75;
        const baseDiff = canvasWidth / 4;
        const lineDiffX = baseDiff / (1 << depth);
        const lineDiffY = 75;

        node.leftLineTarget = this.draw
            .line(node.x, node.y, node.x - lineDiffX, node.y + lineDiffY)
            .attr(lineStyle);

        node.rightLineTarget = this.draw
            .line(node.x, node.y, node.x + lineDiffX, node.y + lineDiffY)
            .attr(lineStyle);

        node.leftLineTarget.back();
        node.rightLineTarget.back();

        node.nodeTarget = this.draw.circle(nodeWidth);
        node.nodeTarget.attr(nodeStyle);
        node.nodeTarget.cx(node.x).cy(node.y);

        node.textTarget = this.draw.text(node.value.toString());
        node.textTarget.attr(textStyle);
        node.textTarget.cx(node.x).cy(node.y);

        this.animationSequence.push([
            node.nodeTarget
            .animate(400)
            .attr({
                opacity: 1,
            }),
            node.textTarget
            .animate(400)
            .attr({
                opacity: 1,
            })
        ])
    }

    public highlightNode(node: Node) {
        this.animationSequence.push([
            node.nodeTarget
            .animate(400)
            .attr({
                fill: '#00ff00',
            }),
        ])

        this.animationSequence.push([
            node.nodeTarget
            .animate(400)
            .attr({
                fill: '#ffffff',
            }),
        ])
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

    // given a node which should also have a valid parent reference, move the line to the
    // appropriate coordinates
    public updateLine(node: Node, animationSequence: Animation[]) {
        // if (node.parent === null) return;

        // animationSequence.push({
        //     targets: [node.lineTarget],
        //     duration: 400,
        //     delay: 0,
        //     simultaneous: true,
        //     attrs: {
        //         x1: node.parent.x,
        //         y1: node.parent.y + 50,
        //         x2: node.x,
        //         y2: node.y + 50,
        //     },
        // });
    }

    public moveLine(node: Node, x1: number, y1: number, x2: number, y2: number, animationSequence: Animation[]) {
        // if (node.parent === null) return;

        // animationSequence.push({
        //     targets: [node.lineTarget],
        //     duration: 400,
        //     delay: 0,
        //     simultaneous: true,
        //     attrs: {
        //         x1: x1,
        //         y1: y1,
        //         x2: x2,
        //         y2: y2,
        //     },
        // });
    }
}
