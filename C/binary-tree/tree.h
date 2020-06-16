#ifndef TREE
#define TREE
#include <stdbool.h> 

struct treeNode {
    int value;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;
 
TreeNode *newNode(int value);
TreeNode *insert(TreeNode *root, int value);
TreeNode *buildTree(int *values, int size);
void printInOrder(TreeNode *root);
void printPreOrder(TreeNode *root);
void printPostOrder(TreeNode *root);
void printLevelOrder(TreeNode *root);
bool existsInTree(TreeNode *root, int targetValue);
TreeNode *leftRotate(TreeNode *root, int targetValue);
TreeNode *rightRotate(TreeNode *root, int targetValue);
TreeNode *delete(TreeNode *root, int targetValue);
TreeNode *getMinNode(TreeNode *root);
void freeTree(TreeNode *root);

#endif
