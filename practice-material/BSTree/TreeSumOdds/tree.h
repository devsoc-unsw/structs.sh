// Header file for tree exercises

#ifndef TREE_H
#define TREE_H

#include <stdbool.h> // Provides the constants 'true' and 'false'

#define MAX_LINE_LEN  8096
#define MAX_TREE_SIZE 1024

typedef struct node *Tree;
struct node {
	int value;
	Tree left;
	Tree right;
};

////////////////////////////////////////////////////////////////////////
// Utility Functions

// You shouldn't use any of these functions in your code. (You shouldn't
// need to.)

/**
 * Reads in two lines of integers representing the preorder and in-order
 * traversals of a tree from stdin and converts them into a binary tree.
 * Assumes  that the lines consist entirely of space-separated integers,
 * are  no  longer  than  8096 characters, and contain no more than 1024
 * integers.
 * If  only  one  tree  needs  to  be read in for a particular exercise,
 * treeNo  should be set to 0. Otherwise, treeNo specifies the number of
 * the tree that is being read in (1, 2, ...).
 */
Tree readTree(int treeNo);

void printTree(Tree t);

void freeTree(Tree t);

#endif

