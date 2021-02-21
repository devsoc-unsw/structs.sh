#ifndef TREE
#define TREE
#include <stdbool.h> 

// Struct definition
struct treeNode {
    int value;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;

// Main operations
int count(TreeNode *root);
int height(TreeNode *root);

TreeNode *newNode(int value);                             // COMMANDS:
TreeNode *insert(TreeNode *root, int value);              // insert
void printInOrder(TreeNode *root);                        // inorder
void printPreOrder(TreeNode *root);                       // preorder
void printPostOrder(TreeNode *root);                      // postorder
void printLevelOrder(TreeNode *root);                     // levelorder
void printGivenLevel(TreeNode *root, int level);          // level
bool existsInTree(TreeNode *root, int targetValue);       // exists
int getNumNodes(TreeNode *root);                          // count
int getTreeHeight(TreeNode *root);                        // height
int getNodeDepth(TreeNode *root, int targetValue);        // depth
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right
TreeNode *delete(TreeNode *root, int targetValue);        // delete
TreeNode *getMinNode(TreeNode *root);                     //
void freeTree(TreeNode *root);                            // clear

// Helper functions
int max(int a, int b);

#endif
