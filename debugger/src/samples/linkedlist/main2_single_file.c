/**
 * Linked list program same as main3.c but all helper functions are defined in
 * this one file.
 * Treelike linked list
 * Diagram: https://imgur.com/JKtOvb8
 */

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

struct node *new_node(int val);
struct list *new_list();
void append(struct list *l, int val);
void print_list(struct node *list);

struct list {
  struct node *head;
  int size;
};

struct node {
  int data;
  struct node *next;
};

typedef struct list List;

int main(int argc, char **argv) {

  struct node *node1 = new_node(1);
  struct node *node2 = new_node(2);
  struct node *node3 = new_node(3);
  struct node *node4 = new_node(4);
  struct node *node5 = new_node(5);
  struct node *node6 = new_node(6);
  struct node *node7 = new_node(7);

  node1->next = node5;
  node2->next = node5;
  node3->next = node6;
  node4->next = node6;
  node5->next = node7;
  node6->next = node7;

  print_list(node1); // 1 -> 5 -> 7 -> X
  print_list(node2); // 2 -> 5 -> 7 -> X
  print_list(node3); // 3 -> 6 -> 7 -> X
  print_list(node4); // 4 -> 6 -> 7 -> X
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
