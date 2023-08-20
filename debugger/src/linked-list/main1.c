#include "linked-list.h"
#include <stdio.h>
#include <stdlib.h>

/**
 * Construct basic linked list using functions to append and remove
 */
int main(int argc, char **argv) {
  struct list *l = new_list();

  append(l, 11);
  append(l, 22);
  append(l, 33);
  append(l, 44);
  append(l, 55);

  print_list(l); // 11 -> 22 -> 33 -> 44 -> 55 -> X

  int val = remove_at(l, 2);
  printf("removed at index 2: %d\n", val); // 33

  int head = remove_head(l);
  printf("removed head: %d\n", head); // 11

  int tail = remove_tail(l);
  printf("removed tail: %d\n", tail); // 55

  print_list(l); // 22 -> 44 -> X
}