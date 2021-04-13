#include <stdio.h>
#include <stdlib.h>
#include <wchar.h>
#include <locale.h>
#include <limits.h>
#include "linked-list.h"
#include "../../util/display/display.h"

struct node {
    int val;
    struct node *next;
};

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

Node *deleteRecursive(Node *head, int targetValue) {
    if (head == NULL) {
        printColoured("red", " ➤ %d wasn't found\n", targetValue);
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

int getLengthRecursive(Node *head) {
    if (head == NULL) {
        return 0;
    }
    return 1 + getLengthRecursive(head -> next);
}

bool searchRecursive(Node *head, int targetValue) {
    if (head == NULL) return false;
    if (head -> val == targetValue) {
        return true;
    } else {
        return searchRecursive(head -> next, targetValue);
    }
}

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

void freeListRecursive(Node *head) {
    if (head == NULL) {
        return;
    }
    Node *nextNode = head -> next;
    free(head);
    freeListRecursive(nextNode);
}

void traverseAndPrintRecursive(Node *head) {
    setlocale(LC_CTYPE, "");
    if (head == NULL) {
        printf("%lc\n", (wint_t)0x2573);
        return;
    }
    printf("%d %lc ", head -> val, (wint_t)0x2192);
    traverseAndPrintRecursive(head -> next);
}

Node *append(Node *head, int newValue) {
    int size = getLengthRecursive(head);
    if (head == NULL) {
        head = insertRecursive(head, newValue, 0);
    } else {
        head = insertRecursive(head, newValue, size);
    }
    return head;
}
