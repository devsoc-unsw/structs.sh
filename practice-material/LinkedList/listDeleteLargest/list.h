// A singly linked list of integers

#ifndef LIST_H
#define LIST_H

#include <stdbool.h> // Provides the constants 'true' and 'false'
#include <stdio.h>
#include <stdlib.h>

#define MAX_LINE_LEN 1024

typedef struct node *Node;
struct node {
	int value;
	Node next;
};

typedef struct list *List;
struct list {
	Node head;
};

/**
 * Creates an empty list
 */
List newList(void);

/**
 * Creates a new node containing the given value.
 */
Node newNode(int value);

////////////////////////////////////////////////////////////////////////
// The functions below are used for testing purposes. You should not use
// them.

/**
 * Reads  in  a line of integers from stdin and converts it into a list.
 * Assumes  that the line consists entirely of space-separated integers,
 * and that the line is no longer than 1024 characters.
 */
List readList(void);

void freeList(List l);

void printList(List l);

/**
 * Prints a list in a set format. For example, the list 1 -> 2 -> 3 -> X
 * is printed as {1, 2, 3}.
 */
void printListSet(List l);

/**
 * Returns a sorted copy of the given list.
 */
List listSortedCopy(List l);

////////////////////////////////////////////////////////////////////////
// The functions below are used to check that certain rules are followed

typedef struct {
	Node addr;
	int value;
} NodeData;

/**
 * Returns  an array containing the addresses and values of the nodes in
 * the given list. The array is terminated with a NULL terminator.
 */
NodeData *getListNodeData(List l);

bool noNewNodes(NodeData *before, NodeData *after);

bool noChangedValues(NodeData *before, NodeData *after);

bool notModified(NodeData *before, NodeData *after);

#endif

