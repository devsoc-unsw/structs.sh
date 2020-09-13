#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "linked-list.h"
#include "../util/colours.h"

#define MAX_COMMAND_SIZE 64

/**
 * Prints supported commands available in interactive mode
 */
void printCommands() {
    char *helpLog = "|===== Commands =====|\n"
                    " ===>  help                     - show commands available\n"
                    " ===>  insert <num> <position>  - inserts a number at the specified position (index starts at 0)\n"
                    " ===>  append <num>             - appends the given number\n"
                    " ===>  delete <num>             - deletes the given number\n"
                    " ===>  search <num>             - searches for the given number\n"
                    " ===>  reverse                  - reverses the current list\n"
                    " ===>  sort                     - sorts the list in ascending order\n"
                    " ===>  show                     - shows the list\n"
                    " ===>  exit                     - quit program\n"
                    "|====================|\n";
    printf("%s", helpLog);
}

/**
 * Prints the state of the given linked list
 */
void printListState(Node *head) {
    printSuccess("|===== List =====|\n  ");
    traverseAndPrintRecursive(head);
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
        int currSize = getLength(head);
        currSize = (currSize - 1 < 0) ? 0 : currSize;
        if (position >= 0 && position <= currSize) {
            printf(" -> Inserting %d at position %d\n", val, position);
            head = insertRecursive(head, val, position);
            printListState(head);
        } else {
            printf("Position out of bounds. Try a position between 0 and %d\n", currSize);
        }
    } else if (strcmp(command, "append") == 0) {
        int val = atoi(strtok(NULL, " "));  
        head = append(head, val);
        printListState(head);
    } else if (strcmp(command, "delete") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Deleting %d\n", val);
        head = deleteRecursive(head, val);
        printListState(head);
    } else if (strcmp(command, "length") == 0) {
        printf(" -> Length: %d\n", getLengthRecursive(head));
    } else if (strcmp(command, "search") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Searching for %d\n", val);
        if (searchRecursive(head, val)) {
            printf("%d exists\n", val);
        } else {
            printf("%d doesn't exist\n", val);
        }
    } else if (strcmp(command, "reverse") == 0) {
        head = reverse(head);
        printListState(head);
    } else if (strcmp(command, "sort") == 0) {
        head = sortListRecursive(head);
        printListState(head);
    } else if (strcmp(command, "show") == 0) {
        printListState(head);
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        freeListRecursive(head);
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
    freeListRecursive(head);
    free(command);

    return 0;
}
