import { Node } from './typedefs';

// used for the actual implementation of the bst
class BST {
    public root: Node;

    constructor() {
        this.root = null;
    }

    public insert(node: Node): void {
        if (this.root == null) {
            this.root = node;
        } else {
            let currentNode: Node = this.root;

            while (currentNode) {
                if (node.value < currentNode.value) {
                    if (currentNode.left == null) {
                        currentNode.left = node;
                        return;
                    }

                    currentNode = currentNode.left;
                } else {
                    if (currentNode.right == null) {
                        currentNode.right = node;
                        return;
                    }

                    currentNode = currentNode.right;
                }
            }
        }
    }
}

export default BST;