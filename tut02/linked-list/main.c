#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "linked-list.h"
#include "../../util/colours.h"

#define MAX_COMMAND_SIZE 64

/**
 * Prints supported commands available in interactive mode
 */
void printCommands() {
    char *helpLog = "|===== Commands =====|\n"
                    " ===>  help                     - show commands available\n"
                    " ===>  insert <num> <position>  - inserts a number at the specified position (index starts at 0)\n"
                    " ===>  length                   - computes the length of the list\n"
                    " ===>  isSorted                 - determines if the list is sorted\n"
                    " ===>  exit                     - quit program\n"
                    "|====================|\n";
    printPrimary(helpLog);
}

/**
 * Prints the state of the given linked list
 */
void printListState(Node *head) {
    printSuccess("|===== List =====|\n  ");
    traverseAndPrint(head);
    printSuccess("|================|\n");
}

/**
 * Given the linked list and the command, processes that command by
 * calling the relevant function from linked-list.c and supplies the 
 * expected arguments. Returns the resultant list after the 
 * command was executed.
 */
Node *processCommand(Node *head, char *command) {
    if (strcmp(command, "help") == 0) { 
        printCommands();
    } else if (strcmp(command, "insert") == 0) {
        int val = atoi(strtok(NULL, " "));  
        int position = atoi(strtok(NULL, " "));  
        int currSize = length(head);
        currSize = (currSize - 1 < 0) ? 0 : currSize;
        if (position >= 0 && position <= currSize) {
            printf(" -> Inserting %d at position %d\n", val, position);
            head = insert(head, val, position);
            printListState(head);
        } else {
            printf("Position out of bounds. Try a position between 0 and %d\n", currSize);
        }
    } else if (strcmp(command, "length") == 0) {
        printf(" -> Length: %d\n", length(head));
    } else if (strcmp(command, "isSorted") == 0) {
        if (isSorted(head)) {
            printf("-> List IS sorted!\n");
        } else {
            printf("-> List is NOT sorted!\n");
        }
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        freeList(head);
        free(command);
        exit(0);
    } else {
        printFailure(" -> Enter a valid command\n");
    }
    return head;
}

int main(int argc, char *argv[]) {
    // Constructing a linked list from the command-line supplied integers
    int numOfValues = argc - 1;
    int *values = malloc(sizeof(int) * numOfValues);
    for (int i = 1; i <= numOfValues; i++) {
        values[i - 1] = atoi(argv[i]);
    }
    // Populating the list with initial values
    Node *head = NULL;
    for (int i = 0; i < numOfValues; i++) {
        head = insert(head, values[i], i);
    }
    free(values);

    // Interactive mode
    char *command = malloc(sizeof(char) * MAX_COMMAND_SIZE);
    printCommands();
    printListState(head);
    while (1) {
        printWarning(" ===> Enter command: ");
        command = fgets(command, MAX_COMMAND_SIZE, stdin);
        printWarning(" You entered: ");
        printPrimary(command);
        // Strips trailing newline character and whitespace
        strtok(command, "\n");
        strtok(command, " ");
        head = processCommand(head, command);
    }
    freeList(head);
    free(command);

    return 0;
}
