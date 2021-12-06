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

    public insert(node: Node): void {
        let low: number = 0;
        let high: number = 1200;
        let mid: number = (low + high) / 2;
        node.x = mid;
        node.y = 0;
        if (this.root == null) {
            this.root = node;
            this.nodes.push(node);
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
                        this.nodes.push(node);
                        return;
                    }

                    currentNode = currentNode.left;
                } else {
                    low = mid;
                    mid = (low + high) / 2;
                    node.x = mid;
                    if (currentNode.right == null) {
                        currentNode.right = node;
                        this.nodes.push(node);
                        return;
                    }

                    currentNode = currentNode.right;
                }
            }
        }
    }
}

export default BST;