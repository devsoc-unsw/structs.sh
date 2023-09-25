export const placeholder = `// Linked List Program from COMP1511 Lecture 7
#include <stdio.h>
#include <stdlib.h>

struct node {
  int data;
  struct node *next;
};

int main(void) {
  // 3 separate allocations on the heap
  struct node *node1 = malloc(sizeof(struct node));
  struct node *node2 = malloc(sizeof(struct node));
  struct node *node3 = malloc(sizeof(struct node));

  // initialise the nodes
  node1->data = 1;
  node2->data = 2;
  node3->data = 3;

  // Set the node1 next pointer
  // to point to the location of node2
  node1->next = node2;
  node2->next = node3;
  node3->next = NULL;

  struct node *curr = node1;

  while (curr != NULL) {
    printf("%d\\n", curr->data);
    curr = curr->next;
  }
}
`;
