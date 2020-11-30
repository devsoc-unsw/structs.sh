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
TreeNode *leftRotate(TreeNode *root);                     // left
TreeNode *rightRotate(TreeNode *root);                    // right
int getTreeHeight(TreeNode *root);                        // height
TreeNode *deleteAVL(TreeNode *root, int targetValue);     // delete
void freeTree(TreeNode *root);                            // clear

// Helper functions                    
void updateHeight(TreeNode *root);
TreeNode *rebalanceAVL(TreeNode *root);
TreeNode *getMinNode(TreeNode *root); 
int max(int a, int b);
int getHeight(TreeNode *root);
int maxHeight(TreeNode *a, TreeNode *b);

#endif
