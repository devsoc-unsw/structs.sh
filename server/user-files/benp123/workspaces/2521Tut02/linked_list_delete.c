#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;
};

struct node *appendNode(struct node *head, int num);
void printList(struct node *head);

/**
 * We implemented this function in class
 */
struct node *listDelete(struct node *list, int value) {
    struct node *curr = list;
    struct node *prev = NULL;
    while (curr != NULL) {
        if (curr->value == value) {
            if (prev == NULL) {
                struct node *new_head = curr->next;
                free(curr);
                return new_head;
            } else {
                prev->next = curr->next;
                free(curr);
                break;
            }
        }

        prev = curr;
        curr = curr->next;
    }
    return list;
}

int main(void) {
    struct node *linked_list = NULL;
    linked_list = appendNode(linked_list, 2);
    linked_list = appendNode(linked_list, 4);
    linked_list = appendNode(linked_list, 6);
    linked_list = appendNode(linked_list, 8);

    printList(linked_list);
    // 2 -> 4 -> 6 -> 8 -> X

    linked_list = listDelete(linked_list, 6);
    printList(linked_list);
    // 2 -> 4   ->    8 -> X

    linked_list = listDelete(linked_list, 8);
    printList(linked_list);
    // 2 -> 4   ->         X

    linked_list = listDelete(linked_list, 2);
    printList(linked_list);
    //      4   ->         X

    linked_list = listDelete(linked_list, 4);
    printList(linked_list);
    //                     X
}

/**
 * Below are helper functions for linked list
 */
struct node *createNode(int num) {
    struct node *newNode = malloc(sizeof(struct node));
    newNode->value = num;
    newNode->next = NULL;
    return newNode;
}

struct node *appendNode(struct node *head, int num) {
    struct node *newNode = createNode(num);

    if (head == NULL) {
        return newNode;
    }

    struct node *curr = head;
    while (curr->next != NULL) {
        curr = curr->next;
    }
    curr->next = newNode;
    return head;
}

void printList(struct node *head) {
    for (struct node *curr = head; curr != NULL; curr = curr->next) {
        printf("%d -> ", curr->value);
    }
    printf("X\n");
}