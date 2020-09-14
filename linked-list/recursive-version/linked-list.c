#include <stdio.h>
#include <stdlib.h>
#include <wchar.h>
#include <locale.h>
#include <limits.h>
#include "linked-list.h"

struct node {
    int val;
    struct node *next;
};

// ===== Inserting Nodes =====
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

// ===== Deleting Nodes =====
// Recursively delete a node with the given target value from the list
Node *deleteRecursive(Node *head, int targetValue) {
    if (head == NULL) {
        return NULL;
    }
    if (head -> val == targetValue) {
        Node *nextNode = head -> next;
        free(head);
        return nextNode;
    }
    head -> next = deleteRecursive(head -> next, targetValue);
    return head;
}

// ===== Determine Length =====
// Recursively count the nodes in a linked list
int getLengthRecursive(Node *head) {
    if (head == NULL) {
        return 0;
    }
    return 1 + getLengthRecursive(head -> next);
}

// ===== Search List =====
// Recursively search for a value in the list. Returns true if the value exists,
// false otherwise
bool searchRecursive(Node *head, int targetValue) {
    if (head == NULL) return false;
    if (head -> val == targetValue) {
        return true;
    } else {
        return searchRecursive(head, targetValue);
    }
}

// ===== Reverse List =====
// Recursively reverse the list
Node *reverseRecursive(Node *head) {
    if (head == NULL || head -> next == NULL) {
        return head;
    }
    Node *nextNode = head -> next;
    Node *reversedListHead = reverseRecursive(nextNode);
    nextNode -> next = head;
    head -> next = NULL;
    return reversedListHead;
}

// ===== Sorting List =====
// Recursively sort the list
Node *sortListRecursive(Node *head) {
    if (head == NULL) return head;
    Node *curr = head;
    int min = INT_MAX;
    Node *minNode = NULL;
    while (curr != NULL) {
        if (curr -> val < min) {
            min = curr -> val;
            minNode = curr; 
        }
        curr = curr -> next;
    }
    minNode -> val = head -> val;
    head -> val = min;
    head -> next = sortListRecursive(head -> next);
    return head;
}

// ===== Free List =====
// Recursively free the nodes of the list
void freeListRecursive(Node *head) {
    if (head == NULL) {
        return;
    }
    Node *nextNode = head -> next;
    free(head);
    freeListRecursive(nextNode);
}

// ===== Traverse List =====
// Recursively traverse and print the list
void traverseAndPrintRecursive(Node *head) {
    setlocale(LC_CTYPE, "");
    if (head == NULL) {
        printf("%lc\n", (wint_t)0x2573);
        return;
    }
    printf("%d %lc ", head -> val, (wint_t)0x2192);
    traverseAndPrintRecursive(head -> next);
}

// ===== Others Functions =====

Node *append(Node *head, int newValue) {
    int size = getLengthRecursive(head);
    if (head == NULL) {
        head = insertRecursive(head, newValue, 0);
    } else {
        head = insertRecursive(head, newValue, size);
    }
    return head;
}
