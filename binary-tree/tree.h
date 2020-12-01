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
TreeNode *insert(TreeNode *root, int value);              // insert <nodes>
void printInOrder(TreeNode *root);                        // inorder
void printPreOrder(TreeNode *root);                       // preorder
void printPostOrder(TreeNode *root);                      // postorder
void printLevelOrder(TreeNode *root);                     // levelorder
void printGivenLevel(TreeNode *root, int level);          // level <num> 
bool existsInTree(TreeNode *root, int targetValue);       // exists <node>
int getNumNodes(TreeNode *root);                          // count
int getTreeHeight(TreeNode *root);                        // height
int getNodeDepth(TreeNode *root, int targetValue);        // depth <node>
TreeNode *leftRotate(TreeNode *root, int targetValue);    // left <node>
TreeNode *rightRotate(TreeNode *root, int targetValue);   // right <node>
TreeNode *delete(TreeNode *root, int targetValue);        // delete <nodes>
void freeTree(TreeNode *root);                            // clear

// Helper functions
TreeNode *getMinNode(TreeNode *root);                     
static int max(int a, int b);

#endif
