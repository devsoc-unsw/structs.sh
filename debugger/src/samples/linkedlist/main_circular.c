/**
 * Circular linked list.
 */

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

struct list {
  struct node *head;
  int size;
};

struct node {
  int data;
  struct node *next;
};

typedef struct list List;

struct node *new_node(int val);
void append(List *l, int val);
void print_list(struct node *list);

int main(int argc, char **argv) {

  struct node *node1 = new_node(1);
  struct node *node2 = new_node(2);
  struct node *node3 = new_node(3);
  struct node *node4 = new_node(4);

  node1->next = node2;
  node2->next = node3;
  node3->next = node4;
  node4->next = node1;
}

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

void print_list(struct node *list) {
  struct node *curr = list;
  while (curr != NULL) {
    printf("%d -> ", curr->data);
    curr = curr->next;
  }
  printf("X\n");
}
