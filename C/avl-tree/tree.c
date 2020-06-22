#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h> 
#include "../util/colours.h"
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
    newTreeNode -> height = 1;
    newTreeNode -> left = NULL;
    newTreeNode -> right = NULL;
    return newTreeNode;
}

/**
 * Given an AVL tree and a value, creates a new node with that
 * value and inserts it into the tree, doing rebalances if 
 * necessary.  
 */
TreeNode *insertAVL(TreeNode *root, int value) {
    if (root == NULL) {
        // Insertion point reached if the tree is empty (vacant position)
        TreeNode *newTreeNode = newNode(value);
        return newTreeNode;
    }

    // Inserting somewhere in the left or right subtrees
    if (value < root -> value) {
        // Insertion point exists somewhere in the left subtree
        root -> left = insertAVL(root -> left, value); 
    } else if (value > root -> value) {
        // Insertion point exists somewhere in the right subtree
        root -> right = insertAVL(root -> right, value);
    } else {
        // Value already exists in the tree. Doing nothing
        printf("Value %d already exists in the tree\n", value);
        return root;
    }

    // Insertion is done by this point. Adjusting height now
    root -> height = 1 + maxHeight(root -> left, root -> right);

    // Rebalancing the tree if the insertion caused a height difference
    // strictly greater than 1
    int lh = getHeight(root -> left);
    int rh = getHeight(root -> right);
    if (lh - rh > 1) {
        // Left subtree has 2 more levels than the right subtree. Need to do a right rotation
        if (value > root -> left -> value) {
            // Value was inserted as the right child of the root -> left. Need to do a left rotation first
            printf("Doing left rotation on node containing %d\n", root -> left -> value);
            root -> left = leftRotate(root, root -> left -> value);
        }
        printf("Doing right rotation on node containing %d\n", root -> value);
        root = rightRotate(root, root -> value);
    }
    if (rh - lh > 1) {
        // Right subtree has 2 more levels than the left subtree. Need to do a left rotation
        if (value < root -> right -> value) {
            // Value was inserted as the left child of the root -> right. Need to do a right rotation first
            printf("Doing right rotation on node containing %d\n", root -> right -> value);
            root -> right = rightRotate(root, root -> right -> value);
        }
        printf("Doing left rotation on node containing %d\n", root -> value);
        root = leftRotate(root, root -> value);
    }
    return root;
}

/**
 * Given a tree, computes and returns the height of that tree
 */
int getTreeHeight(TreeNode *root) {
    return (root == NULL) ? 0 : 1 + max(getTreeHeight(root -> left), getTreeHeight(root -> right));
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
TreeNode *deleteAVL(TreeNode *root, int targetValue) {
    if (root == NULL) {
        printf("Value %d doesn't exist in this tree\n", targetValue);
        return NULL;
    }

    if (targetValue < root -> value) {  
        // Node to delete is somewhere in the left subtree
        root -> left = deleteAVL(root -> left, targetValue);
    } else if (targetValue > root -> value) { // value is in the right sub tree.
        root -> right = deleteAVL(root -> right, targetValue);
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
            root -> right = deleteAVL(root -> right, minNode -> value);
        }
    }
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
static TreeNode *getMinNode(TreeNode *root) {
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

/**
 * Gets the height of a given tree
 */
static int getHeight(TreeNode *root) {
    return (root == NULL) ? 0 : root -> height;
}

/**
 * Given two trees, returns the larger height of the two trees. 
 */
static int maxHeight(TreeNode *a, TreeNode *b) {
    return max(getHeight(a), getHeight(b));  
}