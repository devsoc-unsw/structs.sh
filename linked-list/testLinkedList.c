#include <stdio.h>
#include "linkedList.h"

void printColoured(char *text) {
    printf("\033[0;35m");
    printf("%s", text);
    printf("\033[0m");
}

int main() {
    printColoured("|===== Linked List =====|\n");
    int values[5] = {2, 4, 6, 8, 10};
    Node *head = buildList(values, 5);
    traverseAndPrintRecursive(head);
    head = insertRecursive(head, 69, 0);
    traverseAndPrintRecursive(head);
    head = insertRecursive(head, 420, 6);
    traverseAndPrintRecursive(head);

    printf("REVERSING\n");
    head = reverseRecursive(head);
    traverseAndPrintRecursive(head);

    printf("Count: %d\n", getLengthRecursive(head));
    head = deleteRecursive(head, 8);
    traverseAndPrintRecursive(head);
    head = deleteRecursive(head, 69);
    traverseAndPrintRecursive(head);
    head = deleteRecursive(head, 420);
    traverseAndPrintRecursive(head);
    printf("Count: %d\n", getLengthRecursive(head));
    head = deleteRecursive(head, 4);
    traverseAndPrintRecursive(head);
    head = deleteRecursive(head, 6);
    traverseAndPrintRecursive(head);
    printf("Count: %d\n", getLengthRecursive(head));
    head = deleteRecursive(head, 10);
    traverseAndPrintRecursive(head);
    head = deleteRecursive(head, 0);
    traverseAndPrintRecursive(head);
    printf("Count: %d\n", getLengthRecursive(head));
    freeListRecursive(head);

    return 0;
}
