/**
 * Sort linked list
 */
#include <stdio.h>
#include <stdlib.h>

struct node {
    int data;
    struct node *next;
};

struct list {
    struct node *head;
    int size;
};

void insertion_sort(struct list *list) {
    if (!list->head || !list->head->next) {
        return;  // No need to sort if the list has 0 or 1 elements
    }

    struct node *sorted = NULL;
    struct node *curr = list->head;
    while (curr != NULL) {
        struct node *next = curr->next;
        if (!sorted || sorted->data >= curr->data) {
            curr->next = sorted;
            sorted = curr;
        } else {
            struct node *temp = sorted;
            while (temp != NULL) {
                if (temp->next == NULL || temp->next->data > curr->data) {
                    curr->next = temp->next;
                    temp->next = curr;
                    break;
                }
                temp = temp->next;
            }
        }
        curr = next;
    }
    list->head = sorted;
}

struct node *create_new_node(int data) {
    struct node *new = malloc(sizeof(struct node));
    new->data = data;
    new->next = NULL;
    return new;
}

void append(int value, struct list *list) {
    struct node *new_tail = create_new_node(value);
    if (list->head == NULL) {
        list->head = new_tail;
        return;
    }

    struct node *curr = list->head;
    while (curr->next != NULL) {
        curr = curr->next;
    }

    curr->next = new_tail;
};

void print_list(struct list *list) {
    struct node *curr = list->head;
    while (curr != NULL) {
        printf("%d -> ", curr->data);
        curr = curr->next;
    }
    printf("X\n");
}

int main(int argc, char *argv[]) {
    struct list *list = malloc(sizeof(struct list));
    list->head = NULL;
    append(5, list);
    append(10, list);
    append(12, list);
    append(7, list);
    append(21, list);
    print_list(list);

    insertion_sort(list);
}
