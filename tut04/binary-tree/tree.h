#ifndef TREE
#define TREE
#include <stdbool.h> 

#define NOT_HEIGHT_BALANCED -99

// Struct definition
struct treeNode {
    int value;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;

// Main operations
TreeNode *newNode(int value);                             // COMMANDS:
TreeNode *insert(TreeNode *root, int value);              // insert
void printPostOrder(TreeNode *root);                      // postorder
int getTreeHeight(TreeNode *root);                        // height
int printHeightDiff (TreeNode *t);
int isHeightBalanced (TreeNode *t); 
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right
void freeTree(TreeNode *root);                            // clear

// Helper functions
static int max(int a, int b);

#endif
