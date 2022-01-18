import { Node } from '../util/typedefs';
import { Runner, Container } from '@svgdotjs/svg.js';
import { nodeStyle, nodeWidth, textStyle, lineStyle, canvasPadding } from '../util/settings';

export default class BSTAnimationProducer {
    private animationSequence: Runner[][];
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

    public createNodeLeft(node: Node, parent: Node): void {
        this.animationSequence.push([
            parent.leftLineTarget
            .animate(400)
            .attr({
                opacity: 1,
            }),
        ])

        this.createNode(node);
    }

    public createNodeRight(node: Node, parent: Node): void {
        this.animationSequence.push([
            parent.rightLineTarget
            .animate(400)
            .attr({
                opacity: 1,
            }),
        ])

        this.createNode(node);
    }

    // draws a node on the draw canvas and shows the node
    public createNode(node: Node): void {
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
        this.updateNodes(root, animation);
        this.updateLines(root, animation);
        this.animationSequence.push(animation);
    }

    // TODO: combine this method with updateLines
    public updateNodes(root: Node, animation: Runner[]): void {
        this.updateNodesRecursive(root, animation);
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

    public movePointerToNewRootRightChild(oldRoot: Node): void {
        this.animationSequence.push([
            oldRoot.leftLineTarget
            .animate(400)
            .plot([[oldRoot.x, oldRoot.y], [oldRoot.left.x, oldRoot.left.y]])
        ])
    }

    public movePointerToOldRoot(newRoot: Node): void {
        this.animationSequence.push([
            newRoot.rightLineTarget
            .animate(400)
            .plot([[newRoot.x, newRoot.y], [newRoot.right.x, newRoot.right.y]])
        ])
    }

    public updateLines(root: Node, animation: Runner[]): void {
        this.updateLinesRecursive(root, animation);
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
