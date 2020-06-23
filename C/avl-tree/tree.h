#ifndef TREE
#define TREE
#include <stdbool.h> 

// Struct definition
struct treeNode {
    int value;
    int height;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;

// Main operations
TreeNode *newNode(int value);                             // COMMANDS:
TreeNode *insertAVL(TreeNode *root, int value);           // insert
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right
int getTreeHeight(TreeNode *root);                        // height
// int heightDiff(TreeNode *root);                           // heightDiff
// int isHeightBalanced(TreeNode *root);                     // heightBalanced
TreeNode *deleteAVL(TreeNode *root, int targetValue);     // delete
void freeTree(TreeNode *root);                            // clear

// Helper functions                    
void adjustHeight(TreeNode *root);
TreeNode *rebalanceAVL(TreeNode *root, int insertedValue);

static TreeNode *getMinNode(TreeNode *root); 
static int max(int a, int b);
static int getHeight(TreeNode *root);
static int maxHeight(TreeNode *a, TreeNode *b);

#endif
