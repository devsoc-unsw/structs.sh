#ifndef LINKED_LIST
#define LINKED_LIST

#include <stdbool.h>

struct node {
    int val;
    struct node *next;
};
typedef struct node Node;

/**
 * INSERT: insert <num> <position>
 * Iteratively insert a node into a linked list at the specified position
 * Eg. insert 12 0 appends the node containing 12 to the list
 */
Node *insert(Node *head, int value, int insertionIndex);

/**
 * DELETE: delete <num>
 * Iteratively delete a node with the given target value from the list
 */
Node *delete(Node *head, int targetValue);

/**
 * LENGTH: length
 * Iteratively count the nodes in a linked list
 */
int getLength(Node *head);

/**
 * SEARCH: search <num>
 * Iteratively search for a value in the list. Returns true if the value exists,
 * false otherwise
 */
bool search(Node *head, int targetValue);

/**
 * REVERSE: reverse
 * Iteratively reverse the list
 */
Node *reverse(Node *head);

/**
 * SORT: sort
 * Iteratively sort the list
 */
Node *sortList(Node *head);

/**
 * CLEAR: clear
 * Wipes the values from the list
 */
void freeList(Node *head);

/**
 * SHOW: show
 * Displays the current linked list 
 */
void traverseAndPrint(Node *head);

/**
 * APPEND: append <num>
 * Inserts the node with the given value at the end of the list
 */
Node *append(Node *head, int newValue);

#endif 
