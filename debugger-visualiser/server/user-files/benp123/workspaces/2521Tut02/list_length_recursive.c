/**
 * Run:
 * $ clang 1_list_length.c linked_list.c -o 1_list_length
 * $ ./1_list_length
 */

#include <stdio.h>
#include <stdlib.h>

struct node {
    int value;
    struct node *next;
};

struct list {
    struct node *head;
};

int listLengthContainer(struct list *l);
int listLength(struct node *l);

int main() {
    struct node *list = listIntro();

    int listLengthRes = listLength(list);
    printf("Length of linked list: %d\n", listLengthRes);

    return 0;
}

/**
 * Takes in a container struct to a linked list and returns the length of the
 * contained linked list.
 */
int listLengthContainer(struct list *l) { return listLength(l->head); }

/**
 * Recursive function to find the length of a linked list.
 */
int listLength(struct node *l) {
    if (l == NULL) {
        return 0;
    }
    return 1 + listLength(l->next);
}

/*
 * ==========================================================
 * ==================== Helper Functions ====================
 * ==========================================================
 */

void printList(struct node *l) {
    if (l == NULL) {
        printf("X\n");
        return;
    }
    printf("%d -> ", l->value);
    printList(l->next);
}

struct node *readList(int size) {
    struct node *head = NULL;
    struct node *curr = head;

    for (int i = 0; i < size; i++) {
        int value;
        if (scanf("%d", &value) != 1) {
            break;
        }

        struct node *newNode = createNode(value);

        if (head == NULL) {
            head = newNode;
        } else {
            curr->next = newNode;
        }
        curr = newNode;
    }

    return head;
}

struct node *listIntro() {
    printf("Enter list size: ");
    int size = 0;
    if (scanf("%d", &size) == 0) {
        fprintf(stderr, "error: failed to read list size\n");
        exit(EXIT_FAILURE);
    } else if (size < 0) {
        fprintf(stderr, "error: invalid list size\n");
        exit(EXIT_FAILURE);
    }

    if (size > 0) {
        printf("Enter list values: ");
    }
    struct node *list = readList(size);

    printf("List: ");
    printList(list);
    printf("\n");

    return list;
}

struct node *createNode(int val) {
    struct node *newNode = malloc(sizeof(struct node));
    if (newNode == NULL) {
        fprintf(stderr, "ERROR while creating new node due to failed malloc");
        exit(EXIT_FAILURE);
    }
    newNode->value = val;
    newNode->next = NULL;
    return newNode;
}

struct node *appendVal(struct node *head, int val) {
    struct node *newNode = malloc(sizeof(struct node));

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
