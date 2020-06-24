#include <stdio.h>
#include <stdlib.h>
#include <wchar.h>
#include <locale.h>
#include "linkedList.h"

struct node {
    int val;
    struct node *next;
};

// ===== Building List =====
// Iteratively build a list, given an array of values
Node *buildList(int *values, int size) {
    if (size == 0) {
        return NULL;
    }
    Node *head = malloc(sizeof(struct node));
    Node *curr = head;
    curr -> val = values[0];
    for (int i = 1; i < size; i++) {
        curr -> next = malloc(sizeof(struct node));
        curr -> val = values[i];
        curr = curr -> next;
    }
    return head;
}

// Recursive version
Node *buildListRecursive(int *values, int size) {
    if (size == 0) {
        return NULL;
    }
    Node *curr = malloc(sizeof(struct node));
    curr -> val = values[0];
    curr -> next = buildList(values + 1, size - 1);
    return curr;
}

// ===== Inserting Nodes =====
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

// Recursive version
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
// Iteratively delete a node with the given target value from the list
Node *delete(Node *head, int targetValue) {
    Node *curr = head;
    Node *prev = NULL;
    while (curr != NULL) {
        if (curr -> val == targetValue) {
            Node *nextNode = curr -> next;
            free(curr);
            if (prev == NULL) {
                return nextNode;
            } else {
                prev -> next = nextNode;
                return head;
            }
        }
        prev = curr;
        curr = curr -> next;
    }
}

// Recursive version
Node *deleteRecursive(Node *head, int targetValue) {
    if (head == NULL) {
        return NULL;
    }
    if (head -> val == targetValue) {
        Node *nextNode = head -> next;
        free(head);
        return nextNode;
    }
    head -> next = delete(head -> next, targetValue);
    return head;
}

// ===== Determine Length =====
// Iteratively count the nodes in a linked list
int getLength(Node *head) {
    int count = 0;
    Node *curr = head;
    while (curr != NULL) { 
        count++;
        curr = curr -> next;
    }
    return count;
}

// Recursive version
int getLengthRecursive(Node *head) {
    if (head == NULL) {
        return 0;
    }
    return 1 + getLengthRecursive(head -> next);
}

// ===== Reverse List =====
// Iteratively reverse the list
Node *reverse(Node *head) {
    Node *curr = head;
    Node *prevNode = NULL;
    while (curr != NULL) {
        Node *nextNode = curr -> next;
        curr -> next = prevNode;
        prevNode = curr;
        curr = nextNode;
    }
    return prevNode;
}

// Recursive version
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

// ===== Free List =====
// Iteratively free the nodes of the list
void freeList(Node *head) {
    Node *curr = head;
    while (curr != NULL) {
        Node *nextNode = curr -> next;
        free(curr);
        curr = nextNode;
    }
}

// Recursive version
void freeListRecursive(Node *head) {
    if (head == NULL) {
        return;
    }
    Node *nextNode = head -> next;
    free(head);
    freeListRecursive(nextNode);
}

// ===== Traverse List =====
// Iteratively traverse and print the list
void traverseAndPrint(Node *head) {
    setlocale(LC_CTYPE, "");
    while (head != NULL) {
        // Prints the → unicode character
        printf("%d %lc ", head -> val, (wint_t)0x2192);
        head = head -> next;
    }
    // Prints the ╳ unicode character
    printf("%lc\n", (wint_t)0x2573);
}

// Recursive version
void traverseAndPrintRecursive(Node *head) {
    setlocale(LC_CTYPE, "");
    if (head == NULL) {
        printf("%lc\n", (wint_t)0x2573);
        return;
    }
    printf("%d %lc ", head -> val, (wint_t)0x2192);
    traverseAndPrintRecursive(head -> next);
}
