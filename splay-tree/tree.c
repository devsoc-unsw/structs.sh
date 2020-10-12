#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h> 
#include "tree.h"

#define MAX_TREE_SIZE 64

/**
 * Given a value, mallocs and returns a new tree node initialised with the
 * supplied value.
 */
TreeNode *newNode(int value) {
    TreeNode *newTreeNode = malloc(sizeof(TreeNode));
    newTreeNode -> value = value;
    newTreeNode -> left = NULL;
    newTreeNode -> right = NULL;
    return newTreeNode;
}

/**
 * Given a tree and a value, inserts that value inside the tree.
 * This is the standard BST insert.
 */
TreeNode *insertStandard(TreeNode *root, int value) {
    if (root == NULL) {
        // Insertion point reached if the tree is empty (vacant position)
        TreeNode *newTreeNode = newNode(value);
        return newTreeNode;
    }

    if (value < root -> value) {
        // Insertion point exists somewhere in the left subtree
        root -> left = insertStandard(root -> left, value); 
        root = rightRotate(root, root -> value);
    } else if (value > root -> value) {
        // Insertion point exists somewhere in the right subtree
        root -> right = insertStandard(root -> right, value);
        root = leftRotate(root, root -> value);
    } else {
        // Value already exists in the tree. Doing nothing
        printf("Value %d already exists in the tree\n", value);
    }
    return root;
}

/**
 * Given a tree and a target value, searches for the target value and then
 * lifts that node up to be the new root using a sequence of rotations that
 * are determined by the following 4 cases:
 *   Case 1: target value is somewhere in left-left   - right rotation on root, then right rotation on root again
 *   Case 2: target value is somewhere in left-right  - left rotation on left child, then right rotation on root
 *   Case 3: target value is somewhere in right-left  - right rotation on left child, then left rotation on root
 *   Case 4: target value is somewhere in right-right - left rotation on root, then right rotation on root again 
 */
TreeNode *splay(TreeNode *root, int targetValue) {
    if (root == NULL) return root;
    if (targetValue == root -> value) return root;
    if (targetValue < root -> value) {
        // Target value is somewhere in the left subtree
        TreeNode *leftChild = root -> left;
        // Target value doesn't exist. Just return
        if (leftChild == NULL) {
            return root;
        } else if (targetValue < leftChild -> value) {
            // Case 1: target is in left-left subtree - do right rotation on root first
            leftChild -> left = splay(leftChild -> left, targetValue);
            root = rightRotate(root, root -> value);
        } else if (targetValue > leftChild -> value) {
            // Case 2: target is in left-right subtree - do left rotation on left child first
            leftChild -> right = splay(leftChild -> right, targetValue);
            if (leftChild -> right != NULL) {
                root -> left = leftRotate(leftChild, leftChild -> value);
            }
        }
        // Perform right rotation on root (bringing the inserted value to the root)
        root = rightRotate(root, root -> value);
    } else if (targetValue > root -> value) {
        // Target value is somewhere in the right subtree
        TreeNode *rightChild = root -> right;
        // Target value doesn't exist. Just return
        if (rightChild == NULL) {
            return root;
        } else if (targetValue < rightChild -> value) {
            // Case 3: target is in right-left subtree - do right rotation on right child first
            rightChild -> left = splay(rightChild -> left, targetValue);
            if (rightChild -> left != NULL) {
                root -> right = rightRotate(rightChild, rightChild -> value);
            }
        } else if (targetValue > rightChild -> value) {
            // Case 4: target is in right-right subtree - do left rotation on root first
            rightChild -> right = splay(rightChild -> right, targetValue);
            root = leftRotate(root, root -> value);
        }
        // Perform left rotation on root (bringing the inserted value to the root)
        root = leftRotate(root, root -> value);
    }
    return root;
}

/**
 * Given a tree and a value, inserts that value inside the tree. The
 * inserted value is then lifted up to the root by a sequence of rotations.
 * This involves calling the splay function after doing 
 */
TreeNode *insertSplay(TreeNode *root, int insertValue) {
    // Insertion point reached if the tree is empty (vacant position)
    root = insertStandard(root, insertValue);
    root = splay(root, insertValue);
    return root;
}

/**
 * Given a tree and a target value, returns true if that target value
 * exists in the tree, otherwise returns false.
 */
bool searchStandard(TreeNode *root, int targetValue) {
    if (root == NULL) {
        return false;
    } else if (root -> value == targetValue) {
        return true;
    } 
    if (targetValue < root -> value) {
        // If the value exists, it must exist in the left subtree
        return searchStandard(root -> left, targetValue);
    } else if (targetValue > root -> value) {
        // If the value exists, it must exist in the right subtree
        return searchStandard(root -> right, targetValue);
    }
}

/**
 * Given a tree and a target value, returns true if that target value
 * exists in the tree, otherwise returns false. Also executes the 
 * splay function to lift the target value to the root.
 */
TreeNode *searchSplay(TreeNode *root, int targetValue) {
    if (searchStandard(root, targetValue)) {
        root = splay(root, targetValue);
    }
    return root;
}

/**
 * Executes a left rotation on the node with the given target value.
 * Returns the resultant tree.
 */
TreeNode *leftRotate(TreeNode *root, int targetValue) {
    if (root == NULL) {
        printf("Target value %d wasn't found in the tree\n", targetValue);
        return NULL;
    } else if (root -> value == targetValue) {
        // Found the node to execute the left rotation on
        TreeNode *rightChild = root -> right;
        TreeNode *rightChildLeft = NULL;
        if (rightChild != NULL) {
            rightChildLeft = rightChild -> left;
            root -> right = rightChildLeft;
            rightChild -> left = root;
            return rightChild;
        } else {
            // Can't rotate when there's no right child
            printf("%d doesn't have a right child. Can't left rotate\n", targetValue);
            return root;
        }
    }

    if (targetValue < root -> value) {
        // Target node exists somewhere in the left subtree
        root -> left = leftRotate(root -> left, targetValue);
    } else if (targetValue > root -> value) {
        // Target tree exists somewhere in the right subtree
        root -> right = leftRotate(root -> right, targetValue);
    }
    return root;
}

/**
 * Executes a right rotation on the node with the given target value.
 * Returns the resultant tree.
 */
TreeNode *rightRotate(TreeNode *root, int targetValue) {
    if (root == NULL) {
        printf("Target value %d wasn't found in the tree\n", targetValue);
        return NULL;
    } else if (root -> value == targetValue) {
        // Found the node to execute the right rotation on
        TreeNode *leftChild = root -> left;
        TreeNode *leftChildRight = NULL;
        if (leftChild != NULL) {
            leftChildRight = leftChild -> right;
            root -> left = leftChildRight;
            leftChild -> right = root;
            return leftChild;
        } else {
            // Can't rotate when there's no left child
            printf("%d doesn't have a left child. Can't right rotate\n", targetValue);
            return root;
        }
    }

    if (targetValue < root -> value) {
        // Target node exists somewhere in the left subtree
        root -> left = rightRotate(root -> left, targetValue);
    } else if (targetValue > root -> value) {
        // Target tree exists somewhere in the right subtree
        root -> right = rightRotate(root -> right, targetValue);
    }
    return root;
}

/**
 * Given a tree and a target value, finds the node containing that
 * target value and deletes it from the tree, if it exists. All 4
 * cases are handled as follows:
 *    Case 1: 0 children - Easiest case. Just delete and return
 *    Case 2: only right child exists - replace root with the right child
 *    Case 3: only left child exists - replace root with the left child
 *    Case 4: both children exist - find the min node in right subtree, swap out root with that min node
 */
TreeNode *deleteStandard(TreeNode *root, int targetValue) {
    if (root == NULL) {
        printf("Value %d doesn't exist in this tree\n", targetValue);
        return NULL;
    }

    if (targetValue < root -> value) {  
        // Node to delete is somewhere in the left subtree
        root -> left = deleteStandard(root -> left, targetValue);
    } else if (targetValue > root -> value) { // value is in the right sub tree.
        root -> right = deleteStandard(root -> right, targetValue);
    } else {
        // Case 1: 0 children - Easiest case. Just delete and return
        if (root -> left == NULL && root -> right == NULL) {
            free(root);
            return NULL;
        }
        // Case 2: only right child exists - replace root with the right child
        else if (root -> left == NULL && root -> right != NULL) {
            TreeNode *rightChild = root -> right;
            free(root);
            return rightChild;
        }
        // Case 3: only left child exists - replace root with the left child
        else if (root->right == NULL) {
            TreeNode *leftChild = root -> left;
            free(root);
            return leftChild;
        }
        // Case 4: both children exist - find min node in right subtree, swap out root with that min node
        else {
            TreeNode *minNode = getMinNode(root -> right);
            root -> value = minNode -> value;
            root -> right = deleteStandard(root -> right, minNode -> value);
        }
    }
}

/**
 * Given a tree and a target value, deletes the target value from the tree
 * by lifting the target value to the root (using splay), then performing
 * standard BST deletion on the root node.
 */
TreeNode *deleteSplay(TreeNode *root, int targetValue) {
    // Find the target value and lift it up as the new root
    if (!searchStandard(root, targetValue)) {
        printf("Target value %d doesn't exist.\n", targetValue);
        return root;
    }
    root = splay(root, targetValue);
    // Perform a standard deletion on the root (which contains the target value)
    root = deleteStandard(root, root -> value);
    return root;
}

/**
 * Given a tree, recursively frees every node.
 */
void freeTree(TreeNode *root) {
    if (root == NULL) {
        return;
    }
    freeTree(root -> left);
    freeTree(root -> right);
    free(root);
}

// ===== Private Helper Functions =====
/**
 * Given a tree, returns the node with the minimal value. This 
 * is just going to be the leftmost node.
 */
TreeNode *getMinNode(TreeNode *root) {
    if (root == NULL) {
        return NULL;
    } else if (root -> left == NULL) {
        return root;
    }
    return getMinNode(root -> left);
}

/**
 * Given two numbers a and b, returns the one that's larger.
 */
static int max(int a, int b) {
    return (a > b) ? a : b;
}
