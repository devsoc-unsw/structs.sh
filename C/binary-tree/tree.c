#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h> 
#include "tree.h"
#include "queue/queue.h"

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
 * Given a tree and a value, creates a new asciiNode carrying the value
 * and inserts it into the appropriate position in the tree. Returns
 * the tree with the new asciiNode inserted
 * Doesn't handle duplicate values!
 */
TreeNode *insert(TreeNode *root, int value) {
    if (root == NULL) {
        // Insertion point reached if the tree is empty (vacant position)
        TreeNode *newTreeNode = newNode(value);
        return newTreeNode;
    }

    if (value < root -> value) {
        // Insertion point exists somewhere in the left subtree
        root -> left = insert(root -> left, value); 
    } else if (value > root -> value) {
        // Insertion point exists somewhere in the right subtree
        root -> right = insert(root -> right, value);
    } else {
        // Value already exists in the tree. Doing nothing
        printf("Value %d already exists in the tree\n", value);
        return root;
    }
}

/**
 * Given an array of values and its size, inserts them in order
 * starting from left to right. Returns the fully constructed tree
 * 
 * This function is called when  ./testTree 1 2 3 4 ...  is executed
 */
TreeNode *buildTree(int *values, int size) {
    TreeNode *root = NULL;
    for (int i = 0; i < size; i++) {
        root = insert(root, values[i]);
    }
    return root;
}

/**
 * Inorder printing: left, root, right
 */
void printInOrder(TreeNode *root) {
    if (root == NULL) {
        // Received a tree that is empty. Nothing to print
        return;
    }
    printInOrder(root -> left);
    printf("%d ", root -> value);
    printInOrder(root -> right);
}

/**
 * Preorder printing: root, left, right
 */
void printPreOrder(TreeNode *root) {
    if (root == NULL) {
        // Received a tree that is empty. Nothing to print
        return;
    }
    printf("%d ", root -> value);
    printInOrder(root -> left);
    printInOrder(root -> right);
}

/**
 * Postorder printing: left, right, root
 */
void printPostOrder(TreeNode *root) {
    if (root == NULL) {
        // Received a tree that is empty. Nothing to print
        return;
    }
    printInOrder(root -> left);
    printInOrder(root -> right);
    printf("%d ", root -> value);
}

/**
 * Levelorder printing prints level-by-level using the recursive
 * printGivenLevel function. This could also be done iteratively
 * with the help of a queue.
 */
void printLevelOrder(TreeNode *root) {
    int height = getTreeHeight(root); 
    for (int i = 1; i <= height; i++) {
        printf("Level %d - ", i);
        printGivenLevel(root, i); 
        if (i != height) printf("\n");
    } 
}

/**
 * Given the tree and the target level, prints the nodes on that level
 */
void printGivenLevel(TreeNode *root, int level) { 
    if (root == NULL) return; 
    if (level == 1) printf("%d ", root -> value); 
    else if (level > 1) { 
        printGivenLevel(root -> left, level - 1); 
        printGivenLevel(root -> right, level - 1); 
    } 
} 

/**
 * Given a tree and a target value, returns true if that target value
 * exists in the tree, otherwise returns false
 */
bool existsInTree(TreeNode *root, int targetValue) {
    if (root == NULL) {
        return false;
    } else if (root -> value == targetValue) {
        return true;
    } 
    if (targetValue < root -> value) {
        // If the value exists, it must exist in the left subtree
        return existsInTree(root -> left, targetValue);
    } else if (targetValue > root -> value) {
        // If the value exists, it must exist in the right subtree
        return existsInTree(root -> right, targetValue);
    }
}

/**
 * Given a tree, counts the number of nodes in the tree and returns it.
 *
 *   struct treeNode {
 *       int value;
 *       struct treeNode *left;
 *       struct treeNode *right;
 *   };
 *   typedef struct treeNode TreeNode;
 */
int getNumNodes(TreeNode *root) {
    return (root == NULL) ? 0 : 1 + getNumNodes(root -> left) + getNumNodes(root -> right);
}

/**
 * Given a tree, computes and returns the height of that tree
 */
int getTreeHeight(TreeNode *root) {
    return (root == NULL) ? 0 : 1 + max(getTreeHeight(root -> left), getTreeHeight(root -> right));
}

/**
 * Given a tree and a target value, finds the node with that target value
 * and returns the level it was found in. 
 * A tree with a single level is considered to have a height of 1. 
 * Another interpretation of height considers a tree with a single level to have a height of 0.
 * If the target node was not found, returns -1.
 */
int getNodeDepth(TreeNode *root, int targetValue) {
    if (root == NULL) return -1;
    if (root -> value == targetValue) return 0;

    if (targetValue > root -> value) {
        int depthInRight = getNodeDepth(root -> right, targetValue);
        return (depthInRight == -1) ? (-1) : (1 + depthInRight);
    } else if (targetValue < root -> value) {
        int depthInLeft = getNodeDepth(root -> left, targetValue);
        return (depthInLeft == -1) ? (-1) : (1 + depthInLeft);
    }
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
TreeNode *delete(TreeNode *root, int targetValue) {
    if (root == NULL) {
        printf("Value %d doesn't exist in this tree\n", targetValue);
        return NULL;
    }

    if (targetValue < root -> value) {  
        // Node to delete is somewhere in the left subtree
        root -> left = delete(root -> left, targetValue);
    } else if (targetValue > root -> value) { // value is in the right sub tree.
        root -> right = delete(root -> right, targetValue);
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
            root -> right = delete(root -> right, minNode -> value);
        }
    }
}

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
 * Given two numbers a and b, returns the one that's larger.
 */
static int max(int a, int b) {
    return (a > b) ? a : b;
}
