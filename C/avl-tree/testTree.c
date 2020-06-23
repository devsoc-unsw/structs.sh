#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include "../util/colours.h"
#include "tree-print.h"
#include "tree.h"

#define MAX_COMMAND_SIZE 64
#define STATE_HEADER "Tree State"

/**
 * Prints supported commands available in interactive mode
 */
void printCommands() {
    char *helpLog = "|===== Commands =====|\n"
                    " ===>  help              - show commands available\n"
                    " ===>  left <d>          - perform a left rotation on node with value <d>\n"
                    " ===>  right <d>         - perform a right rotation on node with value <d>\n"
                    " ===>  insert <d>        - inserts a node with the value <d>\n"
                    " ===>  delete <d>        - deletes the node with value <d>\n"
                    " ===>  show              - shows the tree\n"
                    " ===>  showBalance       - shows the balance of all nodes in the tree (left height - right height)\n"
                    " ===>  showHeights       - shows the heights of all nodes in the tree\n"
                    " ===>  clear             - deletes the entire tree\n"
                    " ===>  exit              - quit program\n"
                    "|====================|\n";
    printf("%s", helpLog);
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
        printTreeState(root, STATE_HEADER);
    } else if (strcmp(command, "right") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Rotating right on node with value %d\n", val);
        root = rightRotate(root, val);
        printTreeState(root, STATE_HEADER);
    } else if (strcmp(command, "insert") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Inserting %d\n", val);
        root = insertAVL(root, val);
        printTreeState(root, STATE_HEADER);
    } else if (strcmp(command, "delete") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Deleting %d\n", val);
        root = deleteAVL(root, val);
        printTreeState(root, STATE_HEADER);
    } else if (strcmp(command, "show") == 0) {
        printTreeState(root, STATE_HEADER);
    } else if (strcmp(command, "showBalance") == 0) {
        printTreeBalances(root);
    } else if (strcmp(command, "showHeights") == 0) {
        printTreeHeights(root);
    } else if (strcmp(command, "height") == 0) {
        printf(" -> Height of the tree is: %d\n", getTreeHeight(root));
    } else if (strcmp(command, "clear") == 0) {
        printf(" -> Deleting the whole tree\n");
        freeTree(root);
        root = NULL;
        printTreeState(root, STATE_HEADER);
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
        root = insertAVL(root, values[i]);
    }
    free(values);

    // Interactive mode
    char *command = malloc(sizeof(char) * MAX_COMMAND_SIZE);
    printCommands();
    printTreeState(root, STATE_HEADER);
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
