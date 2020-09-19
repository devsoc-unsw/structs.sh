#ifndef LINKED_LIST
#define LINKED_LIST

#include <stdbool.h>

typedef struct node Node;

Node *insert(Node *head, int value, int insertionIndex);

Node *delete(Node *head, int targetValue);

int getLength(Node *head);

Node *reverse(Node *head);

bool search(Node *head, int targetValue);

Node *sortList(Node *head);

void freeList(Node *head);

void traverseAndPrint(Node *head);

Node *append(Node *head, int newValue);

#endif 
