#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "tree-print.h"
#include "tree.h"
#include "../util/colours.h"
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
    } else if (strcmp(command, "help") == 0) { 
        // Format: help
        if (numArgs != 1) {
            printInvalidCommand("Help command format: length\n");
        } 
        printCommands();
    } else if (strcmp(command, "left") == 0) {
        // Format: left <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Rotating left on node with value %d\n", val);
            root = leftRotate(root, val);
            printTreeState(root);
        }
    } else if (strcmp(command, "right") == 0) {
        // Format: right <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Rotating right on node with value %d\n", val);
            root = rightRotate(root, val);
            printTreeState(root);
        }
    } else if (strcmp(command, "insert") == 0) {
        // Format: insert <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Inserting %d\n", val);
            root = insert(root, val);
            printTreeState(root);
        }
    } else if (strcmp(command, "delete") == 0) {
        // Format: delete <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Deleting %d\n", val);
            root = delete(root, val);
            printTreeState(root);
        }
    } else if (strcmp(command, "exists") == 0) {
        // Format: exists <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Searching for %d\n", val);
            if (existsInTree(root, val)) {
                printf(" ➤ %d exists in this tree!\n", val);
            } else {
                printf(" ➤ %d doesn't exist in this tree!\n", val);
            }
        }
    } else if (strcmp(command, "inorder") == 0) {
        // Format: inorder
        if (numArgs != 1) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            printf(" ➤ Printing in-order\n");
            printInOrder(root);
            printf("\n");
        }
    } else if (strcmp(command, "preorder") == 0) {
        // Format: preorder
        if (numArgs != 1) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            printf(" ➤ Printing pre-order\n");
            printPreOrder(root);
            printf("\n");
        }
    } else if (strcmp(command, "postorder") == 0) {
        // Format: postorder
        if (numArgs != 1) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            printf(" ➤ Printing post-order\n");
            printPostOrder(root);
            printf("\n");
        }
    } else if (strcmp(command, "levelorder") == 0) {
        // Format: inorder
        if (numArgs != 1) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            printf(" ➤ Printing level-order\n");
            printLevelOrder(root);
            printf("\n");
        }
    } else if (strcmp(command, "level") == 0) {
        // Format: level <num>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Printing level %d\n", val);
            printf(" Level %d - ", val);
            printGivenLevel(root, val);
            printf("\n");
        }
    } else if (strcmp(command, "count") == 0) {
        // Format: count
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
            printf(" ➤ Number of nodes in this tree: %d\n", getNumNodes(root));
        }
    } else if (strcmp(command, "height") == 0) {
        // Format: height
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
            printf(" ➤ Height of the tree is: %d\n", getTreeHeight(root));
        }
    } else if (strcmp(command, "depth") == 0) {
        // Format: depth <node>
        if (numArgs != 2 || !isNumeric(tokens[1])) {
            printInvalidCommand("Insert command format: insert <num> <position>\n");
        } else {
            int val = atoi(tokens[1]);
            printf(" ➤ Depth of node %d in tree: %d\n", val, getNodeDepth(root, val));
        }
    } else if (strcmp(command, "clear") == 0) {
        // Format: clear
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
            printf(" ➤ Deleting the whole tree\n");
            freeTree(root);
            root = NULL;
            printTreeState(root);
        }
    } else if (strcmp(command, "exit") == 0) {
        // Format: exit
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
            freeTree(root);
            free(command);
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
        root = insert(root, values[i]);
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
