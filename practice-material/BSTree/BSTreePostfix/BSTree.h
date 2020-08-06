// Header file for BST exercises

#ifndef BSTREE_H
#define BSTREE_H

#include <stdbool.h> // Provides the constants 'true' and 'false'

#define MAX_LINE_LEN 8096
#define MAX_BST_SIZE 1024

typedef struct BSTNode *BSTree;
struct BSTNode {
	int value;
	BSTree left;
	BSTree right;
};

////////////////////////////////////////////////////////////////////////
// Utility Functions

// You shouldn't use any of these functions in your code. (You shouldn't
// need to.)

/**
 * Reads  in a line of integers representing the preorder traversal of a
 * BST from stdin and converts it into a BST.
 * Assumes  that the line consists entirely of space-separated integers,
 * is  no  longer  than  8096 characters, and contains no more than 1024
 * integers.
 * If  only one BST needs to be read in for a particular exercise, bstNo
 * should  be set to 0. Otherwise, bstNo specifies the number of the BST
 * that is being read in (1, 2, ...).
 */
BSTree readBSTree(int bstNo);

void printBSTree(BSTree t);

void freeBSTree(BSTree t);

#endif

