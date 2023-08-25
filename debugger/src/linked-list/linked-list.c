#include "linked-list.h"
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

// Basic list functions
struct node *new_node(int val) {
  struct node *new = malloc(sizeof(struct node));
  new->data = val;
  new->next = NULL;
  return new;
}

List *new_list() {
  List *new = malloc(sizeof(List));
  new->head = NULL;
  new->size = 0;
  return new;
}

void append(List *l, int val) {
  struct node *new = new_node(val);
  if (l->head == NULL) {
    l->head = new;
  } else {
    struct node *curr = l->head;
    while (curr->next != NULL) {
      curr = curr->next;
    }
    curr->next = new;
  }
  l->size++;
  return;
}

/**
 * Expect list with at least one node
 */
int remove_tail(List *l) {
  struct node *prev = NULL;
  struct node *curr = l->head;
  while (curr->next != NULL) {
    prev = curr;
    curr = curr->next;
  }
  prev->next = NULL;
  l->size--;
  int val = curr->data;
  free(curr);
  return val;
}

/**
 * Expects a valid index, < length of the list
 */
int remove_at(List *l, int index) {
  struct node *curr = l->head;
  for (int i = 0; i < index - 1; i++) {
    curr = curr->next;
  }
  // here, curr is 2nd last node
  int val = curr->next->data;
  struct node *temp = curr->next;
  curr->next = temp->next;
  l->size--;
  free(temp);
  return val;
}

/**
 * Expects a list with at least one node
 */
int remove_head(List *l) {
  struct node *temp = l->head;
  l->head = l->head->next;
  l->size--;
  int val = temp->data;
  free(temp);
  return val;
}

void print_list(List *list) {
  struct node *curr = list->head;
  while (curr != NULL) {
    printf("%d -> ", curr->data);
    curr = curr->next;
  }
  printf("X\n");
}
