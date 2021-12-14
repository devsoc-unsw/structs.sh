import { Svg } from '@svgdotjs/svg.js';
import { Node } from './typedefs';

// used for the actual implementation of the bst
class BST {
    public root: Node;

    // TODO: remove later this is only for basic rendering of a bst
    public nodes: Node[];

    constructor() {
        this.root = null;
        this.nodes = [];
    }

    // inserts a node into the bst and returns the node that was inserted.
    // this allows us to draw lines between nodes
    public insert(input: number): Node {
        const node: Node = {
            nodeTarget: null,
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
            this.nodes.push(node);

            return node;
        } else {
            let currentNode: Node = this.root;

            while (currentNode) {
                node.y += 75;
                if (node.value < currentNode.value) {
                    high = mid;
                    mid = (low + high) / 2;
                    node.x = mid;
                    
                    if (currentNode.left == null) {
                        currentNode.left = node;
                        node.parent = currentNode;
                        this.nodes.push(node);
                        return node;
                    }

                    currentNode = currentNode.left;
                } else {
                    low = mid;
                    mid = (low + high) / 2;
                    node.x = mid;
                    if (currentNode.right == null) {
                        currentNode.right = node;
                        node.parent = currentNode;
                        this.nodes.push(node);
                        return node;
                    }

                    currentNode = currentNode.right;
                }
            }
        }
    }
}

export default BST;