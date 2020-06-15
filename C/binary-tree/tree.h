#ifndef TREE
#define TREE

struct treeNode {
    int value;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;

TreeNode *newNode(int value);
TreeNode *insert(TreeNode *root, int value);
TreeNode *buildTree(int *values, int size);

#endif