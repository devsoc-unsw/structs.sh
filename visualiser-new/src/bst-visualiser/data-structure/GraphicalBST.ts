import { Animation, Node } from '../util/typedefs';
import { BSTAnimationProducer} from '../animation-producer/BSTAnimationProducer';

// used for the actual implementation of the bst
class BST {
    public root: Node;
    public animationProducer: BSTAnimationProducer = new BSTAnimationProducer();

    constructor() {
        this.root = null;
    }

    // inserts a node into the bst and produces an animation sequence
    // that is later handled by the animation controller
    public insert(input: number): Animation[] {
        const animationSequence: Animation[] = [];

        const node: Node = {
            nodeTarget: null,
            textTarget: null,
            lineTarget: null,
            left: null,
            right: null,
            parent: null,
            value: input,
            x: 0,
            y: 0
        }

        if (this.root == null) {
            this.root = node;
            this.updateNodePositions();
            this.animationProducer.createNode(node);
            this.animationProducer.showNode(node, animationSequence);
        } else {
            let currentNode: Node = this.root;

            while (currentNode) {
                this.animationProducer.highlightNode(currentNode, animationSequence);
                
                if (node.value < currentNode.value) {
                    if (currentNode.left == null) {
                        currentNode.left = node;
                        node.parent = currentNode;
                        this.updateNodePositions();
                        this.animationProducer.createNode(node);
                        this.animationProducer.showNode(node, animationSequence);
                        
                        return animationSequence;
                    }

                    currentNode = currentNode.left;
                } else {
                    if (currentNode.right == null) {
                        currentNode.right = node;
                        node.parent = currentNode;
                        this.updateNodePositions();
                        this.animationProducer.createNode(node);
                        this.animationProducer.showNode(node, animationSequence);
                       
                        return animationSequence;
                    }

                    currentNode = currentNode.right;
                }
            }
        }

        return animationSequence;
    }

    // use this method after doing bst operations to update
    // x and y coordinates
    public updateNodePositions(): void {
        let low: number = 0;
        let high: number = 1200;
        let mid: number = (low + high) / 2;
        this.updateNodePositionsRecursive(this.root, low, high, mid, 0);
    }

    public updateNodePositionsRecursive(node: Node, low: number, high: number, mid: number, y: number): void {
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
        return this.getNodeRecursive(input, this.root);
    }

    // TODO: remove this
    public getNodeRecursive(input: number, node: Node): Node {
        if (input === node.value) {
            return node;
        } else if (input < node.value) {
            this.getNodeRecursive(input, node.left);
        } else {
            this.getNodeRecursive(input, node.right);
        }
    }

    public rotateRight(input: number): Animation[] {
        const animationSequence: Animation[] = [];
        const root: Node = this.getNode(input);
        const newRoot: Node = root.left;

        if (root === null || newRoot === null) {
            return animationSequence;
        }

        root.left = newRoot.right;
        newRoot.right = root;
        newRoot.parent = null;
        this.root = newRoot;

        this.updateNodePositions();
        // this.animationProducer.moveNode(root, root.x, root.y + 50, animationSequence);
        // this.animationProducer.moveNode(newRoot, newRoot.x, newRoot.y + 50, animationSequence);
        this.moveNodes(animationSequence);

        return animationSequence;
    }

    // TODO: try to get rid of this lol
    public moveNodes(animationSequence: Animation[]): void {
        this.moveNodesRecursive(this.root, animationSequence);
    }

    public moveNodesRecursive(node: Node, animationSequence: Animation[]): void {
        if (node === null) {
            return;
        }

        this.animationProducer.moveNode(node, node.x, node.y + 50, animationSequence);

        this.moveNodesRecursive(node.left, animationSequence);
        this.moveNodesRecursive(node.right, animationSequence);
    }
}

export default BST;