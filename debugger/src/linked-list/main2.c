#include "linked-list.h"
#include <stdlib.h>

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