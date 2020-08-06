// A doubly linked list of integers

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
	Node prev;
};

typedef struct list *List;
struct list {
	Node first;
	Node last;
	int size;
};

/**
 * Creates a new, empty list
 */
List newList(void);

/**
 * Reads  in  a line of integers from stdin and converts it into a list.
 * Assumes  that the line consists entirely of space-separated integers,
 * and that the line is no longer than 1024 characters.
 */
List readList(void);

void freeList(List l);

void printList(List l);

/**
 * Checks  that the given list is a valid doubly linked list (see list.c
 * for more details)
 */
void checkValidity(List l);

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

