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
    struct node *prev = NULL, *curr = head, *next = NULL;
    while (curr != NULL) {
        next = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next;
    }
    head = prev;

    // Print reversed list
    curr = head;
    while (curr != NULL) {
        printf("%d ", curr->data);
        next = curr->next;
        free(curr);
        curr = next;
    }

    return 0;
}
