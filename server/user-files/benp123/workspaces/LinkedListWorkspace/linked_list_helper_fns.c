/**
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
    printf("NULL\n");
}

int main() {
    struct Node *head = NULL;  // Initialize an empty linked list

    // Insert nodes at the beginning of the list
    insertAtBeginning(&head, 3);
    insertAtBeginning(&head, 2);
    insertAtBeginning(&head, 1);

    printf("Final linked list:\n");
    printList(head);  // Output: 1 -> 2 -> 3 -> NULL

    return 0;
}
