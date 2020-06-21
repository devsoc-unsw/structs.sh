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
    return NULL;
}

/**
 * Given a tree and a value, creates a new asciiNode carrying the value
 * and inserts it into the appropriate position in the tree. Returns
 * the tree with the new asciiNode inserted
 * Doesn't handle duplicate values!
 */
TreeNode *insert(TreeNode *root, int value) {
    return NULL;
}

/**
 * Given an array of values and its size, inserts them in order
 * starting from left to right. Returns the fully constructed tree
 */
TreeNode *buildTree(int *values, int size) {
    return NULL;
}

/**
 * Inorder printing: left, root, right
 */
void printInOrder(TreeNode *root) {
    
}

/**
 * Preorder printing: root, left, right
 */
void printPreOrder(TreeNode *root) {
    
}

/**
 * Postorder printing: left, right, root
 */
void printPostOrder(TreeNode *root) {
    
}

/**
 * Levelorder printing prints level-by-level using the recursive
 * printGivenLevel function. This could also be done iteratively
 * with the help of a queue.
 */
void printLevelOrder(TreeNode *root) {
    
}

/**
 * Given the tree and the target level, prints the nodes on that level
 */
void printGivenLevel(TreeNode *root, int level) { 
    
} 

/**
 * Given a tree and a target value, returns true if that target value
 * exists in the tree, otherwise returns false
 */
bool existsInTree(TreeNode *root, int targetValue) {
    return false;
}

/**
 * Given a tree, counts the number of nodes in the tree and returns it.
 */
int getCount(TreeNode *root) {
    return 0;
}

/**
 * Given a tree and a target value, finds the node with that target value
 * and returns the level it was found in. 
 * A tree with a single level is considered to have a height of 1. 
 * Another interpretation of height considers a tree with a single level to have a height of 0.
 * If the target node was not found, returns -1.
 */
int getTreeHeight(TreeNode *root) {
    return 0;
}

/**
 * Given a tree and a target value, finds the node with that target value
 * and returns the level it was found in.
 * If the target node was not found, returns -1.
 */
int getNodeDepth(TreeNode *root, int targetValue) {
    return 0;
}

/**
 * Executes a left rotation on the node with the given target value.
 * Returns the resultant tree.
 */
TreeNode *leftRotate(TreeNode *root, int targetValue) {
    return NULL;
}

/**
 * Executes a right rotation on the node with the given target value.
 * Returns the resultant tree.
 */
TreeNode *rightRotate(TreeNode *root, int targetValue) {
    return NULL;
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
    return NULL;
}

/**
 * Given a tree, returns the node with the minimal value. This 
 * is just the leftmost node.
 */
TreeNode *getMinNode(TreeNode *root) {
    return NULL;
}

/**
 * Given a tree, recursively frees every node.
 */
void freeTree(TreeNode *root) {

}

// ===== Private Helper Functions =====
/**
 * Given two numbers a and b, returns the one that's larger.
 */
static int max(int a, int b) {
    return (a > b) ? a : b;
}

