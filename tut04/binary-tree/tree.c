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
 * Given a tree and a value, inserts that value inside the tree
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







/**
 * Postorder printing: left, right, root
 */
void printPostOrder(TreeNode *root) {
    if (root == NULL) {
        // Received a tree that is empty. Nothing to print
        return;
    }
    printPostOrder(root -> left);
    printPostOrder(root -> right);
    printf("%d ", root -> value);
}










/** 
 * ===== STRUCT DEFINITION =====
 * 
 * struct treeNode {
 *     int value;
 *     struct treeNode *left;
 *     struct treeNode *right;
 * };
 * typedef struct treeNode TreeNode;
 * 
 */



/**
 * What are the smaller problems in this question:
 * 1. Computing the height of a tree
 * 2. Traversing the tree in postfix order (LRN)
 */
int printHeightDiff (TreeNode *t) {
    if (t == NULL) return 1;
    printHeightDiff(t -> left);             // L
    printHeightDiff(t -> right);            // R

    int lh = getTreeHeight(t -> left);
    int rh = getTreeHeight(t -> right);
    int diff = lh - rh;

    printf("data: %d, diff: %d\n", t -> value, diff);      // N
    return 1 + max(lh, rh);
}









/**
 * Given a tree, computes and returns the height of that tree
 */
int getTreeHeight(TreeNode *root) {
    if (root == NULL) return 1;
    int lh = getTreeHeight(root -> left);
    int rh = getTreeHeight(root -> right);
    return 1 + max(lh, rh);
}

int abs(int a) {
    return (a >= 0) ? (a) : (-a);
}

/**
 * If the tree is height-balanced, return the height.
 * Otherwise, return NOT_HEIGHT_BALANCED
 */
// int isHeightBalanced (TreeNode *t) { 
//     if (t == NULL) return 0;

//     int lh = getTreeHeight(t -> left);
//     int rh = getTreeHeight(t -> right);
//     int absDiff = abs(lh - rh);

//     if (absDiff > 1) {
//         return NOT_HEIGHT_BALANCED;
//     } else {
//         int leftIsBalanced = isHeightBalanced(t -> left);
//         int rightIsBalanced = isHeightBalanced(t -> right);
//         if (leftIsBalanced == NOT_HEIGHT_BALANCED || rightIsBalanced == NOT_HEIGHT_BALANCED) {
//             return NOT_HEIGHT_BALANCED;
//         } else {
//             return getTreeHeight(t);
//         }
//     }
// }


int isHeightBalanced (TreeNode *t) { 
    if (t == NULL) return 0;

    int lh = isHeightBalanced(t -> left);
    int rh = isHeightBalanced(t -> right);
    int absDiff = abs(lh - rh);
    if (lh == NOT_HEIGHT_BALANCED || rh == NOT_HEIGHT_BALANCED) {
        return NOT_HEIGHT_BALANCED;
    } 
    return (absDiff <= 1) ? (1 + max(lh, rh)) : (NOT_HEIGHT_BALANCED);
}


