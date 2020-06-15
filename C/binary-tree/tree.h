#ifndef TREE
#define TREE

typedef struct treeNode TreeNode;

TreeNode *newNode(int value);
TreeNode *insert(TreeNode *root, int value);
TreeNode *buildTree(int *values, int size);

#endif