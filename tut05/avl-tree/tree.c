#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h> 
#include "tree.h"
#include "tree-print.h"
#include "../../util/display/display.h"

#define MAX_TREE_SIZE 64
#define LOCAL_STATE_HEADER "Local Tree Fix"
#define LOCAL_IMBALANCE_HEADER "Local Imbalance"




// Gets the height of a given tree
int getHeight(TreeNode *root) {
    if (root == NULL) {
        return 0;
    } else {
        return root -> height;
    }
}


/**
 * Executes a left rotation on the root node.
 * Returns the resultant tree.
 */
TreeNode *leftRotate(TreeNode *root) {
    if (root == NULL) return NULL;

    TreeNode *rightChild = root -> right;
    if (rightChild != NULL) {
        TreeNode *rightChildLeft = rightChild -> left;
        rightChild -> left = root;
        root -> right = rightChildLeft;

        root -> height = 1 + max(getHeight(root -> left), getHeight(root -> right));
        rightChild -> height = 1 + max(getHeight(rightChild -> left), getHeight(rightChild -> right));

        return rightChild;
    } else {
        // Can't do the rotation here. Need to have rightChild
        return root;
    }
}

/**
 * Executes a right rotation on the root node.
 * Returns the resultant tree.
 */
TreeNode *rightRotate(TreeNode *root) {
    if (root == NULL) return NULL;

    TreeNode *leftChild = root -> left;
    if (leftChild != NULL) {
        TreeNode *leftChildRight = leftChild-> right;
        leftChild -> right = root;
        root -> left = leftChildRight;

        root -> height = 1 + max(getHeight(root -> left), getHeight(root -> right));
        leftChild -> height = 1 + max(getHeight(leftChild -> left), getHeight(leftChild -> right));

        return leftChild;
    } else {
        // Can't do the rotation here. Need to have leftChild
        return root;
    }
}













// Struct definition
// struct treeNode {
//     int value;
//     int height;
//     struct treeNode *left;
//     struct treeNode *right;
// };
// typedef struct treeNode TreeNode;

TreeNode *insertAVL(TreeNode *root, int value) {
    // ===== Standard BST insertion =====
    if (root == NULL) {
        // Insertion point reached if the tree is empty (vacant position)
        TreeNode *newTreeNode = newNode(value);
        return newTreeNode;
    }

    if (value < root -> value) {
        root -> left = insertAVL(root -> left, value); 
    } else if (value > root -> value) {
        root -> right = insertAVL(root -> right, value);
    } else {
        // Value already exists in the tree. Doing nothing
        printColoured("red", "Value %d already exists in the tree\n", value);
        return root;
    }

    // ===== AVL STUFF BELOW =====
    // Insertion is done by this point. Now we'll update the height of this node
    int leftH = getHeight(root -> left);
    int rightH = getHeight(root -> right);
    root -> height = 1 + max(leftH, rightH);

    // Rebalancing the tree if the insertion caused a height difference of 2 or -2:
    if (leftH - rightH > 1) {
        // Left subtree is taller than right subtree by 2 levels
        if (value > root -> left -> value) {
            root -> left = leftRotate(root -> left);
        }
        root = rightRotate(root);
    } else if (rightH - leftH > 1) {
        // Right subtree is taller than left subtree by 2 levels
        if (value < root -> right -> value) {
            root -> right = rightRotate(root -> right);
        }
        root = leftRotate(root);
    }
    return root;
}



















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
 * Rebalancing a height-imbalanced node in an AVL tree.
 * 
 * Height imbalances in AVL trees occur in 4 cases:
 *   Case 1. Left-left case   - perform right rotation on current node
 *   Case 2. Left-right case  - perform left rotation on left child, 
 *                              then right rotation on current node
 *   Case 3. Right-left case  - perform right rotation on right child, 
 *                              then left rotation on current node
 *   Case 4. Right-right case - perform left rotation on current node
 */
TreeNode *rebalanceAVL(TreeNode *root) {
    int lh = getHeight(root -> left);
    int rh = getHeight(root -> right);
    if (lh - rh > 1) {
        // Left subtree has 2 more levels than the right subtree. Need to do a right rotation
        printf(" ➤ Imbalance found: left subtree of %d is taller than the right subtree by 2 levels\n", root -> value);
        printCurrTreeState(root, LOCAL_IMBALANCE_HEADER);
        TreeNode *leftChild = root -> left;
        int leftLeftHeight = getHeight(leftChild -> left);
        int leftRightHeight = getHeight(leftChild -> right);
        if (leftRightHeight > leftLeftHeight) {
            // Need to do a left rotation on leftChild first
            printf(" ➤ Doing left rotation on node containing %d\n", leftChild -> value);
            root -> left = leftRotate(leftChild);
            printCurrTreeState(root, LOCAL_STATE_HEADER);
        }
        printf(" ➤ Doing right rotation on node containing %d\n", root -> value);
        root = rightRotate(root);
        printCurrTreeState(root, LOCAL_STATE_HEADER);
    }
    if (rh - lh > 1) {
        // Right subtree has 2 more levels than the left subtree. Need to do a left rotation
        printf(" ➤ Imbalance found: right subtree of %d is taller than the left subtree by 2 levels\n", root -> value);
        printCurrTreeState(root, LOCAL_IMBALANCE_HEADER);
        TreeNode *rightChild = root -> right;
        int rightLeftHeight = getHeight(rightChild -> left);
        int rightRightHeight = getHeight(rightChild -> right);
        if (rightLeftHeight > rightRightHeight) {
            // Need to do a right rotation on rightChild first
            printf(" ➤ Doing right rotation on node containing %d\n", rightChild -> value);
            root -> right = rightRotate(rightChild);
            printCurrTreeState(root, LOCAL_STATE_HEADER);
        }
        printf(" ➤ Doing left rotation on node containing %d\n", root -> value);
        root = leftRotate(root);
        printCurrTreeState(root, LOCAL_STATE_HEADER);
    }
    return root;
}

/**
 * Given a node in a tree, correctly sets its height field. 
 */
void updateHeight(TreeNode *root) {
    root -> height = 1 + maxHeight(root -> left, root -> right);
}

/**
 * Given a tree, computes and returns the height of that tree
 */
int getTreeHeight(TreeNode *root) {
    return (root == NULL) ? 0 : 1 + max(getTreeHeight(root -> left), getTreeHeight(root -> right));
}

/**
 * AVL deletion works by first performing a standard BST deletion,
 * then adjusting the height of the current node, then rebalancing
 * the current node if it is height-imbalanced.
 *
 * Standard BST deletion:
 * Given a tree and a target value, finds the node containing that
 * target value and deletes it from the tree, if it exists. All 4
 * cases are handled as follows:
 *    Case 1: 0 children - Easiest case. Just delete and return
 *    Case 2: only right child exists - replace root with the right child
 *    Case 3: only left child exists - replace root with the left child
 *    Case 4: both children exist - find the min node in right subtree, swap out root with that min node
 */
TreeNode *deleteAVL(TreeNode *root, int targetValue) {
    // === STEP 1 - Standard BST deletion ===
    if (root == NULL) {
        printColoured("red", "Value %d doesn't exist in this tree\n", targetValue);
        return NULL;
    }

    if (targetValue < root -> value) {  
        // Node to delete is somewhere in the left subtree
        root -> left = deleteAVL(root -> left, targetValue);
    } else if (targetValue > root -> value) { // value is in the right sub tree.
        root -> right = deleteAVL(root -> right, targetValue);
    } else {
        // Found the node to be deleted
        // Case 1: 0 children - Easiest case. Just delete and return
        if (root -> left == NULL && root -> right == NULL) {
            free(root);
            return NULL;
        }
        // Case 2: only right child exists - replace root with the right child
        else if (root -> left == NULL && root -> right != NULL) {
            TreeNode *tmpRight = root -> right;
            free(root);
            return NULL;
        }
        // Case 3: only left child exists - replace root with the left child
        else if (root->right == NULL) {
            TreeNode *tmpLeft = root -> left;
            free(root);
            *root = *tmpLeft;
        }
        // Case 4: both children exist - find min node in right subtree, swap out root with that min node
        else {
            TreeNode *minNode = getMinNode(root -> right);
            root -> value = minNode -> value;
            root -> right = deleteAVL(root -> right, minNode -> value);
        }
    }

    // === STEP 2 - Adjusting height ===
    updateHeight(root);

    // === STEP 3 - Find and fix imbalances ===
    root = rebalanceAVL(root);
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
int max(int a, int b) {
    return (a > b) ? a : b;
}


/**
 * Given two trees, returns the larger height of the two trees. 
 */
int maxHeight(TreeNode *a, TreeNode *b) {
    return max(getHeight(a), getHeight(b));  
}