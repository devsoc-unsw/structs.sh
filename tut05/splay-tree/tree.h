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
TreeNode *newNode(int value);                             // COMMANDS:
TreeNode *insertStandard(TreeNode *root, int value);
TreeNode *insertSplay(TreeNode *root, int value);         // insert
bool searchStandard(TreeNode *root, int targetValue);
TreeNode *searchSplay(TreeNode *root, int targetValue);   // search
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right
TreeNode *deleteStandard(TreeNode *root, int targetValue);        
TreeNode *deleteSplay(TreeNode *root, int targetValue);   // delete
void freeTree(TreeNode *root);                            // clear

// Helper functions
TreeNode *getMinNode(TreeNode *root);                     
static int max(int a, int b);

TreeNode *rotateLeft(TreeNode *root);
TreeNode *rotateRight(TreeNode *root);

#endif
