#ifndef LINKED_LIST
#define LINKED_LIST

#include <stdbool.h>

typedef struct node Node;

Node *insert(Node *head, int value, int insertionIndex);
Node *insertRecursive(Node *head, int value, int insertionIndex);

Node *delete(Node *head, int targetValue);
Node *deleteRecursive(Node *head, int targetValue);

int getLength(Node *head);
int getLengthRecursive(Node *head);

Node *reverse(Node *head);
Node *reverseRecursive(Node *head);

bool search(Node *head, int targetValue);
bool searchRecursive(Node *head, int targetValue);

Node *sortList(Node *head);
Node *sortListRecursive(Node *head);

void freeList(Node *head);
void freeListRecursive(Node *head);

void traverseAndPrint(Node *head);
void traverseAndPrintRecursive(Node *head);

Node *append(Node *head, int newValue);

#endif 
