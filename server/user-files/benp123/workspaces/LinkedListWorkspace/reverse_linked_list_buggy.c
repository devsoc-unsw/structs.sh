#include <stdio.h>
#include <stdlib.h>

struct node {
    char data;
    struct node *next;
};

struct node *prepend(struct node *head, char num) {
    struct node *newNode = malloc(sizeof(struct node));
    newNode->data = num;
    newNode->next = head;
    return newNode;
}

int main() {
    struct node *head = NULL;

    head = prepend(head, 'e');
    head = prepend(head, 'v');
    head = prepend(head, 'i');
    head = prepend(head, 'l');

    // Reverse the linked list
    struct node *prev = NULL;
    struct node *curr = head;
    struct node *next = NULL;
    while (curr != NULL) {
        next = curr->next;  // Store next
        prev = curr;        // Move pointers one position ahead
        curr = next;
    }

    // Set head to point to the last node
    head = prev;

    // Print and free the reversed list
    curr = head;
    while (curr != NULL) {
        printf("%c ", curr->data);
        next = curr->next;
        free(curr);
        curr = next;
    }

    return 0;
}
