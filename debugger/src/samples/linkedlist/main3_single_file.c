/**
 * Linked list program same as main3.c but all helper functions are defined in
 * this one file.
 */

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

struct node *new_node(int val);
struct list *new_list();
void append(struct list *l, int val);
int remove_tail(struct list *l);
int remove_at(struct list *l, int index);
int remove_head(struct list *l);
void print_list(struct list *list);

struct list {
  struct node *head;
  int size;
};

struct node {
  int data;
  struct node *next;
};

typedef struct list List;

/**
 * Treelike linked list
 * Diagram: https://imgur.com/JKtOvb8
 */
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

  struct list *l1 = new_list();
  l1->head = node1;
  print_list(l1); // 1 -> 5 -> 7 -> X

  struct list *l2 = new_list();
  l2->head = node2;
  print_list(l2); // 2 -> 5 -> 7 -> X

  struct list *l3 = new_list();
  l3->head = node2;
  print_list(l3); // 3 -> 6 -> 7 -> X

  struct list *l4 = new_list();
  l4->head = node2;
  print_list(l4); // 4 -> 6 -> 7 -> X
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
