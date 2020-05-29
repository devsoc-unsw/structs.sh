#include <stdio.h>
#include <stdlib.h>
#include <wchar.h>
#include <locale.h>

typedef struct node {
    int val;
    struct node *next;
} Node;

// Recursively build a list, given an array of values
Node *buildList(int *values, int size) {
    if (size == 0) {
        return NULL;
    }
    Node *curr = malloc(sizeof(struct node));
    curr -> val = values[0];
    curr -> next = buildList(values + 1, size - 1);
    return curr;
}

// Iteratively insert a node into a linked list
Node *insert(Node *head, int value, int insertionIndex) {
    // Separately deal with the case where we want to insert at the very front of the list
    if (insertionIndex == 0) {
        Node *newHead = malloc(sizeof(struct node));
        newHead -> val = value;
        newHead -> next = head;
        return newHead;
    } else {
        Node *curr = head;
        for (int i = 1; curr != NULL; i++) {
            if (i == insertionIndex) {
                Node *nextNode = curr -> next;
                curr -> next = malloc(sizeof(struct node));
                curr -> next -> val = value;
                curr -> next -> next = nextNode;
                break;
            }
            curr = curr -> next;
        }
        return head;
    }
}

// Recursively insert a node into a linked list
Node *insertRecursive(Node *head, int value, int insertionIndex) {
    if (insertionIndex == 0) {
        Node *newHead = malloc(sizeof(struct node));
        newHead -> val = value;
        newHead -> next = head;
        return newHead;
    }
    head -> next = insertRecursive(head -> next, value, insertionIndex - 1);
    return head;
}

void traverseAndPrint(Node *head) {
    setlocale(LC_CTYPE, "");
    while (head != NULL) {
        printf("%d %lc ", head -> val, (wint_t)0x2192);
        head = head -> next;
    }
    printf("%lc\n", (wint_t)0x2573);
}

int main() {
    int values[5] = {2, 4, 6, 8, 10};
    Node *head = buildList(values, 5);
    traverseAndPrint(head);
    head = insertRecursive(head, 69, 0);
    traverseAndPrint(head);
    head = insertRecursive(head, 420, 6);
    traverseAndPrint(head);
    printf("\033[1;31m");
    printf("Hello world\n");
    printf("\033[0m;")
    return 0;
}
