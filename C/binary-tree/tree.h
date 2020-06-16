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
TreeNode *newNode(int value);
TreeNode *insert(TreeNode *root, int value);
TreeNode *buildTree(int *values, int size);
void printInOrder(TreeNode *root);
void printPreOrder(TreeNode *root);
void printPostOrder(TreeNode *root);
void printLevelOrder(TreeNode *root);
void printGivenLevel(TreeNode *root, int level);
bool existsInTree(TreeNode *root, int targetValue);
int getCount(TreeNode *root);
int getTreeHeight(TreeNode *root);
int getNodeDepth(TreeNode *root, int targetValue);
TreeNode *leftRotate(TreeNode *root, int targetValue);
TreeNode *rightRotate(TreeNode *root, int targetValue);
TreeNode *delete(TreeNode *root, int targetValue);
TreeNode *getMinNode(TreeNode *root);
void freeTree(TreeNode *root);

// Helper functions
static int max(int a, int b);

#endif
