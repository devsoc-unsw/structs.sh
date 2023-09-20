#include "linkedlist.h"
#include <stdio.h>
#include <stdlib.h>

/**
 * Simple linked list constructed granularly without using any functions.
 * Includes the container struct `struct list`
 * Good for testing gdb debugging of linked lists visualisation by just
 * calling `next` over and over again.
 * Diagram: https://imgur.com/JKtOvb8
 */
int main(int argc, char **argv) {

  // Initialise first node
  List *l = malloc(sizeof(*l));
  if (l == NULL) {
    printf("Error");
  }
  l->head = malloc(sizeof(struct node));
  l->head->data = 1;
  l->head->next = NULL;
  l->size = 1;

  // Append second node
  l->head->next = malloc(sizeof(struct node));
  l->head->next->data = 2;
  l->head->next->next = NULL;
  l->size++;

  // Append third node
  struct node *node3 = malloc(sizeof(struct node));
  node3->next = NULL;
  l->head->next->next = node3;
  l->size++; // 3

  // Append fourth node
  struct node *node4 = malloc(sizeof(struct node));
  node4->data = 4;
  node4->next = NULL;
  node3->next = node4;
  l->size++; // 4

  // Append fifth node
  struct node *node5 = malloc(sizeof(struct node));
  node5->data = 5;
  node5->next = NULL;
  node4->next = node5;
  l->size++; // 5

  // Remove fourth node
  struct node *temp = node4;
  node3->next = temp->next;
  free(temp);

  // Print the linked list
  // 1 -> 2 -> 3 -> 5 -> X
  struct node *curr = l->head;
  while (curr != NULL) {
    printf("%d -> ", curr->data);
    curr = curr->next;
  }
  printf("X\n");
}