export const placeholder = `// Linked List Program from COMP1511 Lecture 7
#include <stdio.h>
#include <stdlib.h>

struct node {
  struct node *next;
  int data;
};

int main(void) {
  // 3 separate allocations on the heap
  struct node *head = malloc(sizeof(struct node));
  struct node *linked_list_2 = malloc(sizeof(struct node));
  struct node *linked_list_3 = malloc(sizeof(struct node));

  // initialise the nodes
  head->data = 1;
  linked_list_2->data = 2;
  linked_list_3->data = 3;

  // Set the head next pointer
  // to point to the location of linked_list_2
  head->next = linked_list_2;
  linked_list_2->next = linked_list_3;
  linked_list_3->next = NULL;

  struct node *curr = head;

  while (curr != NULL) {
    printf("%d\n", curr->data);
    curr = curr->next;
  }
}
`;
