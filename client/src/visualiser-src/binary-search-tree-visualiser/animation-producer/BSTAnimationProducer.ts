import { Node } from '../util/typedefs';
import { Runner, Container } from '@svgdotjs/svg.js';

export default class BSTAnimationProducer {
    public animationSequence: Runner[][];
    public draw: Container;

    public getAnimationSequence(): Runner[][] {
        return this.animationSequence;
    }

    // the problem with each BSTAnimationProducer having its own draw canvas created
    // is that svg.js uses an addTo method which would create an extra svg container
    // of max width and height. we don't want this
    public constructor(draw: Container) {
        this.animationSequence = [];
        this.draw = draw;
    }

    public highlightNode(node: Node): void {
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

    public updateBST(root: Node): void {
        const animation: Runner[] = [];
        this.updateNodesRecursive(root, animation);
        this.updateLinesRecursive(root, animation);
        this.animationSequence.push(animation);
    }

    public updateNodesRecursive(node: Node, animation: Runner[]): void {
        if (node === null) {
            return;
        }

        this.updateNode(node, node.x, node.y, animation);
        this.updateNodesRecursive(node.left, animation);
        this.updateNodesRecursive(node.right, animation);
    }

    public updateNode(node: Node, newX: number, newY: number, animation: Runner[]): void {
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

        this.updateNodeLines(node, animation);
        this.updateLinesRecursive(node.left, animation);
        this.updateLinesRecursive(node.right, animation);
    }

    public updateNodeLines(node: Node, animation: Runner[]): void {
        if (node.left != null) {
            animation.push(
                node.leftLineTarget
                .animate(400)
                .plot([[node.x, node.y], [node.left.x, node.left.y]])
            );
        }

        if (node.right != null) {
            animation.push(
                node.rightLineTarget
                .animate(400)
                .plot([[node.x, node.y], [node.right.x, node.right.y]])
            )
        }
    }
}
