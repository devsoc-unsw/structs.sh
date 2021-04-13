#ifndef LINKED_LIST
#define LINKED_LIST

#include <stdbool.h>

typedef struct node Node;
/**
 * INSERT: insert <num> <position>
 * Recursively insert a node into a linked list at the specified position
 * Eg. insert 12 0 appends the node containing 12 to the list
 */
Node *insertRecursive(Node *head, int value, int insertionIndex);

/**
 * DELETE: delete <num>
 * Recursively delete a node with the given target value from the list
 */
Node *deleteRecursive(Node *head, int targetValue);

/**
 * LENGTH: length
 * Recursively count the nodes in a linked list
 */
int getLengthRecursive(Node *head);

/**
 * SEARCH: search <num>
 * Recursively search for a value in the list. Returns true if the value exists,
 * false otherwise
 */
Node *reverseRecursive(Node *head);

/**
 * REVERSE: reverse
 * Recursively reverse the list
 */
bool searchRecursive(Node *head, int targetValue);

/**
 * SORT: sort
 * Recursively sort the list
 */
Node *sortListRecursive(Node *head);

/**
 * CLEAR: clear
 * Wipes the values from the list
 */
void freeListRecursive(Node *head);

/**
 * SHOW: show
 * Displays the current linked list 
 */
void traverseAndPrintRecursive(Node *head);

/**
 * APPEND: append <num>
 * Inserts the node with the given value at the end of the list
 */
Node *append(Node *head, int newValue);

#endif 
