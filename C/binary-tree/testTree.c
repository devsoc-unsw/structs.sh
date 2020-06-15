#include <stdio.h>
#include "tree.h"

int main(int argc, char *argv[]) {
    int values = {4, 6, 2, 8, 3};
    TreeNode *tree = buildTree(values, 5);

    root = insert(root, 4);
    root = insert(root, 2);
    root = insert(root, 6);
    root = insert(root, 5);
    root = insert(root, 1);
    root = insert(root, 7);
    root = insert(root, 3);
    printTree(root);

    return 0;
}
