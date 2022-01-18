import BSTAnimationProducer from '../animation-producer/BSTAnimationProducer';
import { Animation, Node } from '../util/typedefs';
import { SVG, Container } from '@svgdotjs/svg.js';
import { canvasPadding } from '../util/settings';

// used for the actual implementation of the bst
class BST {
    public root: Node = null;
    public draw: Container = SVG().addTo('#bst-canvas').size('100%', '100%');
    
    // inserts a node into the bst and produces an animation sequence
    // that is later handled by the animation controller
    public insert(input: number): BSTAnimationProducer {
        const animationProducer: BSTAnimationProducer = new BSTAnimationProducer(this.draw);
        const node: Node = {
            nodeTarget: null,
            textTarget: null,
            leftLineTarget: null,
            rightLineTarget: null,
            left: null,
            right: null,
            value: input,
            x: 0,
            y: 0,
        };

        if (this.root == null) {
            this.root = node;
            this.updateNodePositions();
            animationProducer.createNode(node);
        } else {
            let currentNode: Node = this.root;

            while (currentNode) {
                animationProducer.highlightNode(currentNode);

                if (node.value < currentNode.value) {
                    if (currentNode.left == null) {
                        currentNode.left = node;
                        this.updateNodePositions();
                        animationProducer.createNode(node);
        
                        return animationProducer;
                    }

                    currentNode = currentNode.left;
                } else {
                    if (currentNode.right == null) {
                        currentNode.right = node;
                        this.updateNodePositions();
                        animationProducer.createNode(node);

                        return animationProducer;
                    }

                    currentNode = currentNode.right;
                }
            }
        }
        return animationProducer;
    }

    // use this method after doing bst operations to update
    // x and y coordinates
    public updateNodePositions(): void {
        const canvasWidth = document.getElementById('bst-canvas').offsetWidth;

        const low: number = 0;
        const high: number = Number(canvasWidth);
        const mid: number = (low + high) / 2;
        this.updateNodePositionsRecursive(this.root, low, high, mid, canvasPadding);
    }

    public updateNodePositionsRecursive(
        node: Node,
        low: number,
        high: number,
        mid: number,
        y: number
    ): void {
        if (node === null) {
            return;
        }

        node.x = mid;
        node.y = y;

        this.updateNodePositionsRecursive(node.left, low, mid, (low + mid) / 2, y + 75);
        this.updateNodePositionsRecursive(node.right, mid, high, (mid + high) / 2, y + 75);
    }

    // returns a node corresponding to the input
    public getNode(input: number): Node {
        // // handle edgecase where no nodes are present
        // if (this.root === null) return null;

        // console.log(this.root);

        // return this.getNodeRecursive(input, this.root);
        return null;
    }

    // TODO: remove this
    public getNodeRecursive(input: number, node: Node): Node {
        // if (input === node.value) {
        //     console.log(node);
        //     return node;
        // } else if (input < node.value) {
        //     this.getNodeRecursive(input, node.left);
        // } else {
        //     this.getNodeRecursive(input, node.right);
        // }

        return null;
    }

    public rotateRight(input: number): Animation[] {
        // console.log(this.root);
        // // console.log(root);
        // const animationSequence: Animation[] = [];
        // const root: Node = this.getNode(input);

        // if (root === null) return animationSequence;

        // console.log(this.root);
        // console.log(root);

        // const newRoot: Node = root.left;

        // if (newRoot === null) return animationSequence;

        // root.left = newRoot.right;
        // root.left.parent = root;

        // // animate the rearrangement of pointer
        // this.animationProducer.updateLine(root.left, animationSequence);
        // this.animationProducer.addSimultaneousDelay(400, animationSequence);

        // newRoot.right = root;
        // root.parent = newRoot;

        // // we also need to swap lineTargets for root and newRoot
        // root.lineTarget = newRoot.lineTarget;
        // newRoot.lineTarget = null;

        // // reorientate the line connecting the old root and new root
        // // this is a bit hacky though
        // root.lineTarget.plot([newRoot.x, newRoot.y + 50, root.x, root.y + 50]);

        // newRoot.parent = null;
        // this.root = newRoot;

        // // sort of hacky try to make cleaner later
        // const x1 = newRoot.x;
        // const y1 = newRoot.y;
        
        // this.updateNodePositions();

        // const x2 = root.x;
        // const y2 = root.y;

        // this.moveNodes(this.root.right, animationSequence);
        // this.updateLines(root, animationSequence);
        // this.animationProducer.addSimultaneousDelay(400, animationSequence);
        // this.animationProducer.moveLine(root, x1, y1 + 50, x2, y2 + 50, animationSequence);
        // this.animationProducer.addSimultaneousDelay(400, animationSequence);
        // this.moveNodes(this.root, animationSequence);
        // this.animationProducer.updateLine(newRoot.right, animationSequence);
        // this.animationProducer.updateLine(newRoot.left, animationSequence);
        // this.animationProducer.addSimultaneousDelay(400, animationSequence);

        return null;
    }

    public moveNodes(root: Node, animationSequence: Animation[]): void {
        // this.moveNodesRecursive(root, animationSequence);
    }

    public moveNodesRecursive(node: Node, animationSequence: Animation[]): void {
        // if (node === null) {
        //     return;
        // }

        // this.animationProducer.moveNode(node, node.x, node.y + 50, animationSequence);

        // this.moveNodesRecursive(node.left, animationSequence);
        // this.moveNodesRecursive(node.right, animationSequence);
    }

    public updateLines(root: Node, animationSequence: Animation[]): void {
        // this.updateLinesRecursive(root.left, animationSequence);
        // this.updateLinesRecursive(root.right, animationSequence);
    }

    public updateLinesRecursive(node: Node, animationSequence: Animation[]): void {
        // if (node === null) {
        //     return;
        // }

        // this.animationProducer.updateLine(node, animationSequence);
        // this.updateLinesRecursive(node.left, animationSequence);
        // this.updateLinesRecursive(node.right, animationSequence);
    }
}

export default BST;
