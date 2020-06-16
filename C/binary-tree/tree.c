#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h> 
#include "tree.h"

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
        // Insertion point reached if the tree is empty
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
 */
TreeNode *buildTree(int *values, int size) {
    TreeNode *root = NULL;
    for (int i = 0; i < size; i++) {
        root = insert(root, values[i]);
    }
    return root;
}

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

TreeNode *getMinNode(TreeNode *root) {
    if (root == NULL) {
        return NULL;
    } else if (root -> left == NULL) {
        return root;
    }
    return getMinNode(root -> left);
}

void freeTree(TreeNode *root) {
    if (root == NULL) {
        return;
    }
    freeTree(root -> left);
    freeTree(root -> right);
    free(root);
}
