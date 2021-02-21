#ifndef ASCII_TREE
#define ASCII_TREE
#include "tree.h"

typedef struct asciiNode AsciiNode;

AsciiNode *buildAsciiTreeRecursive(TreeNode *t);
AsciiNode *buildAsciiTree(TreeNode * t);
void freeAsciiTree(AsciiNode *asciiNode);
void computeLProfile(AsciiNode *asciiNode, int x, int y);
void computeRProfile(AsciiNode *asciiNode, int x, int y);
void computeEdgeLengths(AsciiNode *asciiNode);
void printLevel(AsciiNode *asciiNode, int x, int level);
void printTree(TreeNode *t);

#endif