import { Node, Animation } from '../util/typedefs';
import { SVG, Runner, Container } from '@svgdotjs/svg.js';
import { nodeSettings } from '../util/settings';

export default class BSTAnimationProducer {
    private animationSequence: Runner[][];
    public draw: Container;

    public getAnimationSequence() {
        return this.animationSequence;
    }

    public constructor(draw: Container) {
        this.animationSequence = [];
        this.draw = draw;
    }

    // draws a node which is composed of svgs and adds svg references to
    // the node
    // TODO: remove hardcoded value of 50
    public createNode(node: Node) {
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

    public highlightNode(node: Node) {
        // this.animationSequence.push({
        //     targets: [node.nodeTarget],
        //     duration: 400,
        //     delay: 200,
        //     simultaneous: false,
        //     attrs: {
        //         fill: '#00ff00',
        //     },
        // });

        // animationSequence.push({
        //     targets: [node.nodeTarget],
        //     duration: 400,
        //     delay: 200,
        //     simultaneous: false,
        //     attrs: {
        //         fill: '#ffffff',
        //     },
        // });
    }

    public showNode(node: Node) {
        this.animationSequence.push([
            node.nodeTarget
            .animate(1000)
            .attr({
                opacity: 1,
            }),
            node.textTarget
            .animate(1000)
            .attr({
                opacity: 1,
            })
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
        if (node.parent === null) return;

        animationSequence.push({
            targets: [node.lineTarget],
            duration: 400,
            delay: 0,
            simultaneous: true,
            attrs: {
                x1: node.parent.x,
                y1: node.parent.y + 50,
                x2: node.x,
                y2: node.y + 50,
            },
        });
    }

    public moveLine(node: Node, x1: number, y1: number, x2: number, y2: number, animationSequence: Animation[]) {
        if (node.parent === null) return;

        animationSequence.push({
            targets: [node.lineTarget],
            duration: 400,
            delay: 0,
            simultaneous: true,
            attrs: {
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
            },
        });
    }

    // this will add a delay after a sequence of simultaneous instructions.
    // this should be removed while the visualiser is being refactored
    public addSimultaneousDelay(delay: number, animationSequence: Animation[]) {
        animationSequence.push({
            targets: [],
            duration: delay,
            delay: 0,
            simultaneous: false,
            attrs: {},
        });
    }
}
