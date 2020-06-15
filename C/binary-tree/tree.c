#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "tree.h"

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
    } else {
        // Insertion point exists somewhere in the right subtree
        root -> right = insert(root -> right, value);
    }
}

TreeNode *buildTree(int *values, int size) {
    TreeNode *root = NULL;
    for (int i = 0; i < size; i++) {
        root = insert(root, values[i]);
    }
    return root;
}


