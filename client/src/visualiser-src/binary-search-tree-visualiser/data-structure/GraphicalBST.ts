import BSTAnimationProducer from '../animation-producer/BSTAnimationProducer';
import { Node } from '../util/typedefs';
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
                        animationProducer.createNodeLeft(node, currentNode);
        
                        return animationProducer;
                    }

                    currentNode = currentNode.left;
                } else {
                    if (currentNode.right == null) {
                        currentNode.right = node;
                        this.updateNodePositions();
                        animationProducer.createNodeRight(node, currentNode);

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
        // handle edgecase where no nodes are present
        if (this.root === null) return null;

        return this.getNodeRecursive(input, this.root);
    }

    // TODO: remove this
    public getNodeRecursive(input: number, node: Node): Node {
        if (input === node.value) {
            return node;
        } else if (input < node.value) {
            return this.getNodeRecursive(input, node.left);
        } else {
            return this.getNodeRecursive(input, node.right);
        }
    }

    public rotateRight(input: number): BSTAnimationProducer {
        const animationProducer: BSTAnimationProducer = new BSTAnimationProducer(this.draw);
        const oldRoot: Node = this.getNode(input);

        if (oldRoot === null) return animationProducer;

        const newRoot: Node = oldRoot.left;

        if (newRoot === null) return animationProducer;

        oldRoot.left = newRoot.right;
        newRoot.right = oldRoot;
        this.root = newRoot;
        
        animationProducer.movePointerToNewRootRightChild(oldRoot);
        animationProducer.movePointerToOldRoot(newRoot);
        this.updateNodePositions();

        animationProducer.updateBST(this.root);

        return animationProducer;
    }
}

export default BST;
