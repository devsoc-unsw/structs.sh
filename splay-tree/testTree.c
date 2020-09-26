#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "tree-print.h"
#include "tree.h"
#include "../util/menu-interface.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"

#define MAX_COMMAND_SIZE 64

/**
 * Prints the state of the given tree (ascii art)
 */
void printTreeState(TreeNode *root) {
    printHeader("Showing Tree");
    printf("\n");
    printTree(root);
    printf("\n");
    printHeader("Done Showing");
}

/**
 * Given the tree and the command, processes that command by
 * calling the relevant function from tree.c and supplies the 
 * expected arguments. Returns the resultant tree after the 
 * command was executed.
 */
TreeNode *processCommand(TreeNode *root, char *command) {
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
    } else if (strcmp(commandName, "left") == 0) {
        // Format: left <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Left command format: left <node>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Rotating left on node with value %d\n", val);
            root = leftRotate(root, val);
            printTreeState(root);
        }
    } else if (strcmp(commandName, "right") == 0) {
        // Format: right <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Right command format: right <node>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Rotating right on node with value %d\n", val);
            root = rightRotate(root, val);
            printTreeState(root);
        }
    } else if (strcmp(commandName, "insert") == 0) {
        // Format: insert <node>
        if (numArgs < 2) {
            printInvalidCommand("Insert command format: insert <node>\n");
        } else {
            for (int i = 0; i < numArgs - 1; i++) {
                if (!isNumeric(tokens[i + 1])) {
                    printColoured("red", " ➤ %s is not numeric\n", tokens[i + 1]);
                } else {
                    int val = atoi(tokens[i + 1]);
                    printf(" ➤ Inserting %d\n", val);
                    root = insertSplay(root, val);
                    printTreeState(root);
                }
            }
        }
    } else if (strcmp(commandName, "delete") == 0) {
        // Format: delete <node>
        if (numArgs < 2) {
            printInvalidCommand("Delete command format: Delete <node>\n");
        } else {
            for (int i = 0; i < numArgs - 1; i++) {
                if (!isNumeric(tokens[i + 1])) {
                    printColoured("red", " ➤ %s is not numeric\n", tokens[i + 1]);
                } else {
                    int val = atoi(tokens[i + 1]);
                    printf(" ➤ Deleting %d\n", val);
                    root = deleteSplay(root, val);
                    printTreeState(root);
                }
            }
            
        }
    } else if (strcmp(commandName, "search") == 0) {
        // Format: exists <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Exists command format: exists <node>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Searching for %d\n", val);
            if (searchSplay(root, val)) {
                printf(" ➤ %d exists in this tree!\n", val);
            } else {
                printf(" ➤ %d doesn't exist in this tree!\n", val);
            }
        }
    } else if (strcmp(commandName, "clear") == 0) {
        // Format: clear
        if (numArgs != 1) {
            printInvalidCommand("Clear command format: clear\n");
        } else {
            printf(" ➤ Deleting the whole tree\n");
            freeTree(root);
            root = NULL;
            printTreeState(root);
        }
    } else if (strcmp(commandName, "show") == 0) {
        printTreeState(root);
    } else if (strcmp(commandName, "exit") == 0) {
        // Format: exit
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
            freeTree(root);
            free(commandName);
            returnToMenu();
        }
    } else {
        printInvalidCommand("Unknown command\n");
    }
    return root;
}

int main(int argc, char *argv[]) {
    // Constructing a tree from the command-line supplied integers
    int numOfValues = argc - 1;
    int *values = malloc(sizeof(int) * numOfValues);
    for (int i = 1; i <= numOfValues; i++) {
        values[i - 1] = atoi(argv[i]);
    }
    TreeNode *root = NULL;
    for (int i = 0; i < numOfValues; i++) {
        root = insertSplay(root, values[i]);
    }
    free(values);

    // Interactive mode
    char *command = malloc(sizeof(char) * MAX_COMMAND_SIZE);
    printCommands();
    printTreeState(root);
    while (1) {
        printPrompt("Enter command");
        command = fgets(command, MAX_COMMAND_SIZE, stdin);
        // Ignore processing empty strings
        if (notEmpty(command)) {
            root = processCommand(root, command);
        }
    }
    freeTree(root);
    free(command);
    return 0;
}
