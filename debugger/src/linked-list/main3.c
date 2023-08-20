#include "linked-list.h"
#include <stdio.h>
#include <stdlib.h>

/**
 * Simple linked list constructed granularly without using any functions.
 * Good for testing gdb debugging of linked lists visualisation by just
 * calling `next` over and over again.
 * Diagram: https://imgur.com/JKtOvb8
 */
int main(int argc, char **argv) {

  // Initialise first node
  struct node *node1 = malloc(sizeof(struct node));
  node1->data = 1;
  node1->next = NULL;

  // Append second node
  struct node *node2 = malloc(sizeof(struct node));
  node2->data = 2;
  node2->next = NULL;
  node1->next = node2;

  // Append third node
  struct node *node3 = malloc(sizeof(struct node));
  node3->data = 3;
  node3->next = NULL;
  node2->next = node3;

  // Append fourth node
  struct node *node4 = malloc(sizeof(struct node));
  node4->data = 4;
  node4->next = NULL;
  node3->next = node4;

  // Append fifth node
  struct node *node5 = malloc(sizeof(struct node));
  node5->data = 5;
  node5->next = NULL;
  node4->next = node5;

  // Remove third node
  struct node *temp = node3;
  node2->next = temp->next;
  free(temp);

  // Print the linked list
  // 1 -> 2 -> 4 -> 5 -> X
  struct node *curr = node1;
  while (curr != NULL) {
    printf("%d -> ", curr->data);
    curr = curr->next;
  }
  printf("X\n");
}