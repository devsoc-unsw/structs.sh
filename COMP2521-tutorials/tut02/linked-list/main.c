#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <libgen.h>
#include "linked-list.h"
#include "../../../util/colours.h"
#include "../../../util/menu-interface.h"
#include "../../../util/display/display.h"
#include "../../../util/utilities/processing.h"

#define MAX_COMMAND_SIZE    64
#define MAX_LINE            256
#define COMMANDS_FILE       "commands.txt"

/**
 * Prints the state of the given linked list
 */
void printListState(Node *head) {
    printHeader("Showing List");
    printf("\n");
    traverseAndPrint(head);
    printf("\n");
    printHeader("Done Showing");
}

/**
 * Given the linked list and the command, processes that command by
 * calling the relevant function from linked-list.c and supplies the 
 * expected arguments. Returns the resultant list after the 
 * command was executed.
 */
Node *processCommand(Node *head, char *command) {
    char **tokens = tokenise(command);
    char *commandName = tokens[0];
    int numArgs = getNumTokens(tokens);
    char *token = commandName;
    if (numArgs <= 0) {
    } else if (!commandName) {
        printInvalidCommand("Enter a valid command\n");
    } else if (strcmp(commandName, "help") == 0) { 
        // Format: help
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
            printCommands();
        }
    } else if (strcmp(commandName, "insert") == 0) {
        // Format: insert <num> <position>
        if (numArgs != 3 || !isNumeric(tokens[1]) || !isNumeric(tokens[2])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            int position = atoi(tokens[2]);
            int currSize = getLength(head);
            currSize = (currSize - 1 < 0) ? 0 : currSize;
            if (position >= 0 && position <= currSize) {
                head = insert(head, val, position);
                printListState(head);
            } else {
                printColoured("red", "Position out of bounds. Try a position between 0 and %d\n", currSize);
            }
        }
    } else if (strcmp(commandName, "append") == 0) {
        // Format: append <num>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Append command format: append <num>\n");
        } else {
            int val = atoi(tokens[1]);
            head = append(head, val);
            printListState(head);
        }
    } else if (strcmp(commandName, "delete") == 0) {
        // Format: delete <num>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Delete command format: delete <num>\n");
        } else {
            int val = atoi(tokens[1]);
            head = delete(head, val);
            printListState(head);
        }
    } else if (strcmp(commandName, "length") == 0) {
        // Format: length
        if (numArgs != 1) {
            printInvalidCommand("Length command format: length\n");
        } else {
            printColoured("yellow", " ➤ Length: %d\n", getLength(head));
        }
    } else if (strcmp(commandName, "search") == 0) {
        // Format: search <num>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Search command format: search\n");
        } else {
            int val = atoi(tokens[1]);
            if (search(head, val)) {
                printColoured("green", "%d exists\n", val);
            } else {
                printColoured("red", "%d doesn't exist\n", val);
            }
        }
    } else if (strcmp(commandName, "reverse") == 0) {
        // Format: reverse
        if (numArgs != 1) {
            printInvalidCommand("Reverse command format: reverse\n");
        } else {
            head = reverse(head);
            printListState(head);
        }
    } else if (strcmp(commandName, "sort") == 0) {
        // Format: sort
        if (numArgs != 1) {
            printInvalidCommand("Sort command format: sort\n");
        } else {
            head = sortList(head);
            printListState(head);
        }
    } else if (strcmp(commandName, "show") == 0) {
        // Format: show
        if (numArgs != 1) {
            printInvalidCommand("Show command format: show\n");
        } else {
            printListState(head);
        }
    } else if (strcmp(commandName, "clear") == 0) {
        // Format: clear
        if (numArgs != 1) {
            printInvalidCommand("Clear command format: clear\n");
        } else {
            freeList(head);
            head = NULL;
            printListState(head);
        }
    } else if (strcmp(commandName, "exit") == 0) {
        // Format: exit
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
            freeList(head);
            free(commandName);
            returnToMenu();
        }
    } else {
        printInvalidCommand("Unknown command\n");
    }
    freeTokens(tokens);
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
        printPrompt("Enter command");
        command = fgets(command, MAX_COMMAND_SIZE, stdin);
        // Ignore processing empty strings
        if (notEmpty(command)) {
            head = processCommand(head, command);
        }
    }
    freeList(head);
    free(command);
    return 0;
}
