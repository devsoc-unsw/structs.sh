#include <stdio.h>
#include <stdlib.h>

struct node {
    char data;
    struct node* next;
};

struct list {
    struct node* head;
    struct node* tail;
};

struct node* createNode(char data) {
    struct node* newNode = malloc(sizeof(struct node));
    newNode->data = data;
    newNode->next = NULL;
    return newNode;
}

void prependNode(struct list* list, char data) {
    if (list->head == NULL) {
        // List is empty, set list to point to new node.
        list->head = createNode(data);
        list->tail = list->head;
    } else if (list->tail == NULL) {
        // Head exists but tail does not (strange), so prepend to head.
        list->tail = list->head;
        struct node* newNode = createNode(data);
        newNode->next = list->head;
        list->head = newNode;
    } else {
        // Prepend to head.
        struct node* newNode = createNode(data);
        newNode->next = list->head;
        list->head = newNode;
    }
}

void appendNode(struct list* list, char data) {
    if (list->head == NULL) {
        // List is empty, set list to point to new node.
        list->head = createNode(data);
        list->tail = list->head;
    } else if (list->tail == NULL) {
        // Head exists but tail does not (strange), so append to head.
        list->tail = createNode(data);
        list->head->next = list->tail;
    } else {
        // Append to tail.
        list->tail->next = createNode(data);
        list->tail = list->tail->next;
    }
}

// Function to reverse the linked list
void reverseLinkedList(struct list* list) {
    if (list->head == NULL || list->tail == NULL) {
        return;
    }
    list->tail = list->head;
    struct node* prev = NULL;
    struct node* curr = list->head;
    struct node* next = NULL;
    while (curr != NULL) {
        next = curr->next;  // Store next
        curr->next = prev;  // Reverse curr node's pointer
        prev = curr;        // Move pointers one position ahead
        curr = next;
    }
    list->head = prev;
}

// Function to print the linked list
void printList(struct list* list) {
    struct node* curr = list->head;
    while (curr != NULL) {
        printf("%d ", curr->data);
        curr = curr->next;
    }
    printf("\n");
}

int main() {
    struct list* list = malloc(sizeof(struct list));
    list->head = NULL;
    list->tail = NULL;

    // Add nodes to the list
    prependNode(list, 'l');
    prependNode(list, 'i');
    prependNode(list, 'v');
    prependNode(list, 'e');

    // Reverse the linked list
    reverseLinkedList(list);

    return 0;
}
