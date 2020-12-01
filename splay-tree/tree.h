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
TreeNode *insertSplay(TreeNode *root, int value);         // insert
TreeNode *searchSplay(TreeNode *root, int targetValue);   // search
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right
TreeNode *deleteSplay(TreeNode *root, int targetValue);   // delete
void freeTree(TreeNode *root);                            // clear

// Helper functions
TreeNode *insertStandard(TreeNode *root, int value);
bool searchStandard(TreeNode *root, int targetValue);
TreeNode *deleteStandard(TreeNode *root, int targetValue);        
TreeNode *getMinNode(TreeNode *root);                     
static int max(int a, int b);

#endif
