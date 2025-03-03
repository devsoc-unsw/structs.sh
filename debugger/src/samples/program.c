#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

void func1(int *arr, int len, int modify);
double slow_pow(double base, int exponent);
double fast_pow(double base, int exponent);

struct node {
  int data;
  struct node *next;
};

struct list {
  struct node *head;
};

typedef struct noded noded_t;
struct noded {
  double data;
  struct noded *prev;
  struct noded *next;
};

typedef struct listd listd_t;
struct listd {
  struct noded *head;
  struct noded *tail;
  int size;
};

// List functions
struct node *new_node(int val);
struct node *new_list(int val);
void append(struct node *list, int val);
void remove_back(struct node *list);
void remove_val(struct node *list, int val);
struct node *remove_head(struct node *list);

// Contained list functions
noded_t *new_noded(double val);
listd_t *new_listd(double val);
void appendd(listd_t *list, double val);
void remove_backd(listd_t *list);
void remove_val_d(listd_t *list, double val);
void remove_headd(listd_t *list);

void appendList(int value, struct list *list) {
  struct node *new_tail = new_node(value);
  if (list->head == NULL) {
    list->head = new_tail;
    return;
  }

  struct node *curr = list->head;
  while (curr->next != NULL) {
    curr = curr->next;
  }

  curr->next = new_tail;
};

void print_list(struct list *list) {
  struct node *curr = list->head;
  while (curr != NULL) {
    printf("%d -> ", curr->data);
    curr = curr->next;
  }
  printf("X\n");
}

int main(int argc, char **argv) {
  int a = 1;
  int b = 2;

  int *arr = malloc(100 * sizeof(int));
  for (int i = 0; i < 100; i++) {
    arr[i] = fast_pow(i, i % 5);
  }

  func1(arr, 100, 12);

  puts("The array is:\n");
  for (int i = 0; i < 100; i++) {
    printf("%d\n", arr[i]);
  }
  putchar('\n');

  int c[5] = {9, 5, 7, 9, 0};
  printf("The stack array c is as [%d, %d, %d, %d, %d]\n", c[0], c[1], c[2],
         c[3], c[4]);

  struct node *list = new_list(24);
  append(list, 21);
  append(list, 33);
  remove_val(list, 21);
  append(list, 1);
  append(list, 19);
  remove_back(list);

  listd_t *dlist = new_listd(19.5);
  appendd(dlist, 0.5);
  appendd(dlist, 12);
  remove_backd(dlist);
  appendd(dlist, 12.765);
  appendd(dlist, 43.095);
  appendd(dlist, 23);
  appendd(dlist, 12);
  appendd(dlist, 23);
  remove_val_d(dlist, 23);
  remove_val_d(dlist, 12);
  remove_val_d(dlist, 12);

  struct list *list2 = malloc(sizeof(struct list));
  list2->head = NULL;
  appendList(5, list2);
  appendList(10, list2);
  appendList(21, list2);
  appendList(234, list2);
  appendList(67, list2);
  print_list(list2);

  // Treelike linked list
  // Diagram: https://imgur.com/JKtOvb8
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
}

void func1(int *arr, int len, int modify) {
  for (int i = 0; i < len; i++) {
    if (i % 2 == 0) {
      arr[i] += modify;
    } else {
      arr[i] *= modify;
    }
  }
}

double slow_pow(double base, int exponent) {
  int res = 1;
  for (int i = 0; i < exponent; i++) {
    res *= base;
  }

  return res;
}

double fast_pow(double base, int exponent) {
  if (exponent == 0) {
    return 1;
  } else if (exponent == 1) {
    return base;
  } else {
    if (exponent % 2 == 0) {
      double temp = fast_pow(base, exponent / 2);
      return temp * temp;
    } else {
      double temp = fast_pow(base, exponent / 2);
      return temp * temp * base;
    }
  }
}

// Basic list functions
#pragma region basic list functions

struct node *new_node(int val) {
  struct node *new = malloc(sizeof(struct node));
  new->data = val;
  new->next = NULL;
  return new;
}

struct node *new_list(int val) { return new_node(val); }

void append(struct node *list, int val) {
  struct node *new = new_node(val);
  struct node *curr = list;
  while (curr->next != NULL) {
    curr = curr->next;
  }
  curr->next = new;
}

void remove_back(struct node *list) {
  struct node *curr = list;
  while (curr->next->next != NULL) {
    curr = curr->next;
  }
  free(curr->next);
  curr->next = NULL;
}

void remove_val(struct node *list, int val) {
  struct node *curr = list;
  while (curr->next != NULL) {
    if (curr->next->data == val) {
      struct node *temp = curr->next->next;
      free(curr->next);
      curr->next = temp;
      break;
    }
    curr = curr->next;
  }
}

struct node *remove_head(struct node *list) {
  struct node *temp = list->next;
  free(list);
  return temp;
}
#pragma endregion

#pragma region contained list functions

noded_t *new_noded(double val) {
  noded_t *new = malloc(sizeof(noded_t));
  new->data = val;
  new->next = NULL;
  new->prev = NULL;
  return new;
}

listd_t *new_listd(double val) {
  noded_t *elem = new_noded(val);
  listd_t *new = malloc(sizeof(listd_t));
  new->head = elem;
  new->tail = elem;
  new->size = 1;
  return new;
}

void appendd(listd_t *list, double val) {
  noded_t *elem = new_noded(val);
  elem->prev = list->tail;
  list->tail->next = elem;
  list->tail = elem;
  list->size++;
}

void remove_backd(listd_t *list) {
  noded_t *temp = list->tail;
  list->tail = list->tail->prev;
  list->tail->next = NULL;
  free(temp);
  list->size--;
}

// This function has bugs with 1 or 0 elements
void remove_val_d(listd_t *list, double val) {
  noded_t *curr = list->head;
  while (curr->next != NULL) {
    if (curr->data == val) {
      curr->prev->next = curr->next;
      curr->next->prev = curr->prev;
      free(curr);
      list->size--;
      break;
    }
    curr = curr->next;
  }
}

// This function has bugs with 1 or 0 elements
void remove_headd(listd_t *list) {
  noded_t *temp = list->head;
  list->head = list->head->next;
  list->head->prev = NULL;
  list->size--;
  free(temp);
}

#pragma endregion
