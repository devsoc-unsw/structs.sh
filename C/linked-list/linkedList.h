#ifndef LINKED_LIST
#define LINKED_LIST

typedef struct node Node;

Node *buildList(int *values, int size);
Node *buildListRecursive(int *values, int size);

Node *insert(Node *head, int value, int insertionIndex);
Node *insertRecursive(Node *head, int value, int insertionIndex);

Node *delete(Node *head, int targetValue);
Node *deleteRecursive(Node *head, int targetValue);

int getLength(Node *head);
int getLengthRecursive(Node *head);

Node *reverse(Node *head);
Node *reverseRecursive(Node *head);

void freeList(Node *head);
void freeListRecursive(Node *head);

void traverseAndPrint(Node *head);
void traverseAndPrintRecursive(Node *head);

#endif 
