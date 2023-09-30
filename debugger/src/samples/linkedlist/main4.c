/**
 * Simple linked list program, no imports.
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

// Function to remove a node with a specific data value
void removeNode(struct Node **head, int data) {
  struct Node *current = *head;
  struct Node *prev = NULL;

  // Traverse the list to find the node to remove
  while (current != NULL && current->data != data) {
    prev = current;
    current = current->next;
  }

  // If the node with the specified data is found
  if (current != NULL) {
    // Update the previous node's next pointer
    if (prev != NULL) {
      prev->next = current->next;
    } else {
      // If the head node itself needs to be removed
      *head = current->next;
    }
    // Free the memory of the removed node
    free(current);
  }
}

// Function to print the linked list
void printList(struct Node *head) {
  struct Node *current = head;
  while (current != NULL) {
    printf("%d -> ", current->data);
    current = current->next;
  }
  printf("NULL\n");
}

int main() {
  struct Node *head = NULL; // Initialize an empty linked list

  // Insert nodes at the beginning of the list
  insertAtBeginning(&head, 3);
  insertAtBeginning(&head, 2);
  insertAtBeginning(&head, 1);

  printf("Initial linked list:\n");
  printList(head); // Output: 1 -> 2 -> 3 -> NULL

  // Remove a node with data value 2
  removeNode(&head, 2);

  printf("Linked list after removing 2:\n");
  printList(head); // Output: 1 -> 3 -> NULL

  // Clean up and free memory
  while (head != NULL) {
    struct Node *temp = head;
    head = head->next;
    free(temp);
  }

  return 0;
}
