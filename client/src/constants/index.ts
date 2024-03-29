/**
 * Top entry will be used as the default program to show in the code editor of
 * dev mode.
 */
export const PLACEHOLDER_PROGRAMS: { name: string; text: string }[] = [
  {
    name: 'Simple linked list COMP1511',
    text: `// Linked List Program from COMP1511 Lecture 7
#include <stdio.h>
#include <stdlib.h>

struct node {
  int data;
  struct node *next;
};

int main(void) {
  // 3 separate allocations on the heap
  struct node *node1 = malloc(sizeof(struct node));
  struct node *node2 = malloc(sizeof(struct node));
  struct node *node3 = malloc(sizeof(struct node));

  // initialise the nodes
  node1->data = 1;
  node2->data = 2;
  node3->data = 3;

  // Set the node1 next pointer
  // to point to the location of node2
  node1->next = node2;
  node2->next = node3;
  node3->next = NULL;

  struct node *curr = node1;

  while (curr != NULL) {
    printf("%d\\n", curr->data);
    curr = curr->next;
  }
}
`,
  },
  {
    name: 'Treelike linked list',
    text: `/**
* Treelike linked list
* Diagram: https://imgur.com/JKtOvb8
*/

#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

struct node *new_node(int val);
struct list *new_list();
struct node *append(struct node *head, int val);
void print_list(struct node *list);

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

struct node *append(struct node *head, int val) {
  struct node *new = new_node(val);
  if (head == NULL) {
    return new;
  } else {
    struct node *curr = head;
    while (curr->next != NULL) {
      curr = curr->next;
    }
    curr->next = new;
  }
  return head;
}

void print_list(struct node *list) {
  struct node *curr = list;
  while (curr != NULL) {
    printf("%d -> ", curr->data);
    curr = curr->next;
  }
  printf("X\\n");
}
`,
  },
  {
    name: 'Linked list helper functions',
    text: `/**
 * Simple linked list program using helper functions.
 */

#include <stdio.h>
#include <stdlib.h>

// Define a node structure
struct Node {
  int data;
  struct Node *next;
};

// Function to create a new node
struct Node *createNode(int data) {
  struct Node *node = malloc(sizeof(*node));
  if (node == NULL) {
    perror("Failed to allocate memory for a new node");
    exit(EXIT_FAILURE);
  }
  node->data = data;
  node->next = NULL;
  return node;
}

// Function to insert a node at the beginning of the list
void insertAtBeginning(struct Node **head, int data) {
  struct Node *newNode = createNode(data);
  newNode->next = *head;
  *head = newNode;
}

// Function to print the linked list
void printList(struct Node *head) {
  struct Node *current = head;
  while (current != NULL) {
    printf("%d -> ", current->data);
    current = current->next;
  }
  printf("NULL\\n");
}

int main() {
  struct Node *head = NULL; // Initialize an empty linked list

  // Insert nodes at the beginning of the list
  insertAtBeginning(&head, 3);
  insertAtBeginning(&head, 2);
  insertAtBeginning(&head, 1);

  printf("Final linked list:\\n");
  printList(head); // Output: 1 -> 2 -> 3 -> NULL

  return 0;
}
`,
  },
  {
    name: 'Sort linked list',
    text: `/**
  * Sort linked list
  */
#include <stdio.h>
#include <stdlib.h>

struct node {
    int data;
    struct node *next;
};

struct list {
    struct node *head;
    int size;
};

void insertion_sort(struct list *list) {
    if (!list->head || !list->head->next) {
        return; // No need to sort if the list has 0 or 1 elements
    }

    struct node *sorted = NULL;
    struct node *curr = list->head;
    while (curr != NULL) {
        struct node *next = curr->next;
        if (!sorted || sorted->data >= curr->data) {
            curr->next = sorted;
            sorted = curr;
        } else {
            struct node *temp = sorted;
            while (temp != NULL) {
                if (temp->next == NULL || temp->next->data > curr->data) {
                    curr->next = temp->next;
                    temp->next = curr;
                    break;
                }
                temp = temp->next;
            }
        }
        curr = next;
    }
    list->head = sorted;
}

struct node *create_new_node(int data) {
    struct node *new = malloc(sizeof(struct node));
    new->data = data;
    new->next = NULL;
    return new;
}

void append(int value, struct list *list) {
    struct node *new_tail = create_new_node(value);
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
    printf("X\\n");
}

int main(int argc, char *argv[]) {
    struct list *list = malloc(sizeof(struct list));
    list->head = NULL;
    append(5, list);
    append(10, list);
    append(12, list);
    append(7, list);
    append(21, list);
    print_list(list);

    insertion_sort(list);
}
`,
  },
];
