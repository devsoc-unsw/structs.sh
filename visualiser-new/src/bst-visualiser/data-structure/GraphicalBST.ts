import { Node } from '../util/typedefs';
import { BSTAnimationProducer} from '../animation-producer/BSTAnimationProducer';
import { Runner } from '@svgdotjs/svg.js';

// used for the actual implementation of the bst
class BST {
    public root: Node;
    public animationProducer: BSTAnimationProducer = new BSTAnimationProducer();

    constructor() {
        this.root = null;
    }

    // inserts a node into the bst and returns the node that was inserted.
    // this allows us to draw lines between nodes
    public insert(input: number): Runner[] {
        const animationSequence: Runner[] = [];

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

        let low: number = 0;
        let high: number = 1200;
        let mid: number = (low + high) / 2;
        node.x = mid;
        node.y = 0;

        if (this.root == null) {
            this.root = node;
            this.animationProducer.createNode(node);
            this.animationProducer.showNode(node, animationSequence);
        } else {
            let currentNode: Node = this.root;

            while (currentNode) {
                this.animationProducer.highlightNode(currentNode, animationSequence);
                
                node.y += 75;
                if (node.value < currentNode.value) {
                    high = mid;
                    mid = (low + high) / 2;
                    node.x = mid;
                    
                    if (currentNode.left == null) {
                        currentNode.left = node;
                        node.parent = currentNode;
                        this.animationProducer.createNode(node);
                        this.animationProducer.showNode(node, animationSequence);
                        return animationSequence;
                    }

                    currentNode = currentNode.left;
                } else {
                    low = mid;
                    mid = (low + high) / 2;
                    node.x = mid;
                    if (currentNode.right == null) {
                        currentNode.right = node;
                        node.parent = currentNode;
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
}

export default BST;