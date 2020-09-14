#ifndef LINKED_LIST
#define LINKED_LIST

#include <stdbool.h>

typedef struct node Node;

Node *insertRecursive(Node *head, int value, int insertionIndex);

Node *deleteRecursive(Node *head, int targetValue);

int getLengthRecursive(Node *head);

Node *reverseRecursive(Node *head);

bool searchRecursive(Node *head, int targetValue);

Node *sortListRecursive(Node *head);

void freeListRecursive(Node *head);

void traverseAndPrintRecursive(Node *head);

Node *append(Node *head, int newValue);

#endif 
