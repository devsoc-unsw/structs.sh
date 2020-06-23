#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "../util/colours.h"
#include "tree-print.h"
#include "tree.h"

#define MAX_COMMAND_SIZE 64

/**
 * Prints supported commands available in interactive mode
 */
void printCommands() {
    char *helpLog = "|===== Commands =====|\n"
                    " ===>  help        - show commands available\n"
                    " ===>  left <d>    - perform a left rotation on node with value <d>\n"
                    " ===>  right <d>   - perform a right rotation on node with value <d>\n"
                    " ===>  insert <d>  - inserts a node with the value <d>\n"
                    " ===>  delete <d>  - deletes the node with value <d>\n"
                    " ===>  search <d>  - searches for the node with value <d>\n"
                    " ===>  clear       - deletes the entire tree\n"
                    " ===>  exit        - quit program\n"
                    "|====================|\n";
    printf("%s", helpLog);
}

/**
 * Prints the state of the given tree (ascii art)
 */
void printTreeState(TreeNode *root) {
    printSuccess("|===== Tree State =====|\n");
    printTree(root);
    printSuccess("|======================|\n");
}

/**
 * Given the tree and the command, processes that command by
 * calling the relevant function from tree.c and supplies the 
 * expected arguments. Returns the resultant tree after the 
 * command was executed.
 */
TreeNode *processCommand(TreeNode *root, char *command) {
    if (strcmp(command, "help") == 0) { 
        printCommands();
    } else if (strcmp(command, "left") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Rotating left on node with value %d\n", val);
        root = leftRotate(root, val);
        printTreeState(root);
    } else if (strcmp(command, "right") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Rotating right on node with value %d\n", val);
        root = rightRotate(root, val);
        printTreeState(root);
    } else if (strcmp(command, "insert") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Inserting %d\n", val);
        root = insertSplay(root, val);
        printTreeState(root);
    } else if (strcmp(command, "delete") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Deleting %d\n", val);
        root = deleteSplay(root, val);
        printTreeState(root);
    } else if (strcmp(command, "search") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Searching for %d\n", val);
        if (searchSplay(root, val)) {
            printf(" -> %d found in this tree!\n", val);
        } else {
            printf(" -> %d doesn't exist in this tree!\n", val);
        }
    } else if (strcmp(command, "clear") == 0) {
        printf(" -> Deleting the whole tree\n");
        freeTree(root);
        root = NULL;
        printTreeState(root);
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        freeTree(root);
        free(command);
        exit(0);
    } else {
        printFailure(" -> Enter a valid command\n");
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
        root = insertStandard(root, values[i]);
    }
    free(values);

    // Interactive mode
    char *command = malloc(sizeof(char) * MAX_COMMAND_SIZE);
    printCommands();
    printTreeState(root);
    while (1) {
        printWarning(" ===> Enter command: ");
        command = fgets(command, MAX_COMMAND_SIZE, stdin);
        printWarning(" You entered: ");
        printPrimary(command);
        // Strips trailing newline character and whitespace
        strtok(command, "\n");
        strtok(command, " ");
        root = processCommand(root, command);
    }
    freeTree(root);
    free(command);
    return 0;
}
