#ifndef ASCII_TREE
#define ASCII_TREE
#include "tree.h"

// Tree printing options:
#define PRINT_VALUES  1
#define PRINT_BALANCE 2
#define PRINT_HEIGHTS 3

typedef struct asciiNode AsciiNode;

AsciiNode *buildAsciiTreeRecursive(TreeNode *t, int option);
AsciiNode *buildAsciiTree(TreeNode * t, int option);
void freeAsciiTree(AsciiNode *asciiNode);
void computeLProfile(AsciiNode *asciiNode, int x, int y);
void computeRProfile(AsciiNode *asciiNode, int x, int y);
void computeEdgeLengths(AsciiNode *asciiNode);
void printLevel(AsciiNode *asciiNode, int x, int level);
void printTree(TreeNode *t, int option);
void printCurrTreeState(TreeNode *root, char *message);
void printTreeBalances(TreeNode *root);
void printTreeHeights(TreeNode *root);

#endif