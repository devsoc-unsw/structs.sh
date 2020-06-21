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
                    " ===>  help              - show commands available\n"
                    " ===>  left <d>          - perform a left rotation on node with value <d>\n"
                    " ===>  right <d>         - perform a right rotation on node with value <d>\n"
                    " ===>  insert <d>        - inserts a node with the value <d>\n"
                    " ===>  delete <d>        - deletes the node with value <d>\n"
                    " ===>  height            - prints the height of the tree\n"
                    " ===>  heightDiff        - prints the tree difference between left and right subtrees at all nodes in postfix ordering\n"
                    " ===>  isHeightBalanced  - checks if the tree is height-balanced\n"
                    " ===>  clear             - deletes the entire tree\n"
                    " ===>  exit              - quit program\n"
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
        root = insert(root, val);
        printTreeState(root);
    } else if (strcmp(command, "delete") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Deleting %d\n", val);
        root = delete(root, val);
        printTreeState(root);
    } else if (strcmp(command, "exists") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Searching for %d\n", val);
        if (existsInTree(root, val)) {
            printf(" -> %d exists in this tree!\n", val);
        } else {
            printf(" -> %d doesn't exist in this tree!\n", val);
        }
    } else if (strcmp(command, "inorder") == 0) {
        printf(" -> Printing in-order\n");
        printInOrder(root);
        printf("\n");
    } else if (strcmp(command, "preorder") == 0) {
        printf(" -> Printing pre-order\n");
        printPreOrder(root);
        printf("\n");
    } else if (strcmp(command, "postorder") == 0) {
        printf(" -> Printing post-order\n");
        printPostOrder(root);
        printf("\n");
    } else if (strcmp(command, "levelorder") == 0) {
        printf(" -> Printing level-order\n");
        printLevelOrder(root);
        printf("\n");
    } else if (strcmp(command, "level") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Printing level %d\n", val);
        printf(" Level %d - ", val);
        printGivenLevel(root, val);
        printf("\n");
    } else if (strcmp(command, "count") == 0) {
        printf(" -> Number of nodes in this tree: %d\n", getNumNodes(root));
    } else if (strcmp(command, "height") == 0) {
        printf(" -> Height of the tree is: %d\n", getTreeHeight(root));
    } else if (strcmp(command, "depth") == 0) {
        int val = atoi(strtok(NULL, " "));  
        printf(" -> Depth of node %d in tree: %d\n", val, getNodeDepth(root, val));
    } else if (strcmp(command, "isHeightBalanced") == 0) {
        if (isHeightBalanced(root)) {
            printf(" -> Tree is height balanced!\n");
        } else {
            printf(" -> Tree is NOT height balanced!\n");
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
        root = insert(root, values[i]);
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
