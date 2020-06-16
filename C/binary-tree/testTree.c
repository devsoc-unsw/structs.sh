#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../util/colours.h"
#include "tree-print.h"
#include "tree.h"

#define MAX_COMMAND_SIZE 64

void printCommands() {
    char *helpLog = " ===>  exit        - quit program\n"
                    " ===>  left <d>    - perform a left rotation on node with value <d>\n"
                    " ===>  right <d>   - perform a right rotation on node with value <d>\n"
                    " ===>  insert <d>  - inserts a node with the value <d>\n"
                    " ===>  delete <d>  - deletes the node with value <d>\n"
                    " ===>  exists <d>  - searches for the node with value <d>\n"
                    " ===>  inorder     - prints the nodes of the tree in ascending order\n"
                    " ===>  preorder    - prints the nodes of the tree in pre-order\n"
                    " ===>  postorder   - prints the nodes of the tree in post-order\n"
                    " ===>  levelorder  - prints the nodes of the tree in level-order\n"
                    " ===>  clear       - deletes the entire tree\n";
    printf("%s", helpLog);
    printWarning(" ===>  ");
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
    while (1) {
        printSuccess("|===== Tree State =====|\n");
        printTree(root);
        printSuccess("|======================|\n");
        printCommands();
        command = fgets(command, MAX_COMMAND_SIZE, stdin);
        // Strips trailing newline character
        strtok(command, "\n");
        strtok(command, " ");
        printf(" You entered %s\n", command);
        if (strcmp(command, "left") == 0) {
            int val = atoi(strtok(NULL, " "));  
            printf(" Rotating left on node with value %d\n", val);
            root = leftRotate(root, val);
        } else if (strcmp(command, "right") == 0) {
            int val = atoi(strtok(NULL, " "));  
            printf(" Rotating right on node with value %d\n", val);
            root = rightRotate(root, val);
        } else if (strcmp(command, "insert") == 0) {
            int val = atoi(strtok(NULL, " "));  
            printf(" Inserting %d\n", val);
            root = insert(root, val);
        } else if (strcmp(command, "delete") == 0) {
            int val = atoi(strtok(NULL, " "));  
            printf(" Deleting %d\n", val);
            root = delete(root, val);
        } else if (strcmp(command, "exists") == 0) {
            int val = atoi(strtok(NULL, " "));  
            printf(" Searching for %d\n", val);
            if (existsInTree(root, val)) {
                printf(" %d exists in this tree!\n", val);
            } else {
                printf(" %d doesn't exist in this tree!\n", val);
            }
        } else if (strcmp(command, "clear") == 0) {
            printf(" Deleting the whole tree\n");
            freeTree(root);
            root = NULL;
        } else if (strcmp(command, "inorder") == 0) {
            printf(" Printing in-order\n");
            printInOrder(root);
            printf("\n");
        } else if (strcmp(command, "preorder") == 0) {
            printf(" Printing pre-order\n");
            printPreOrder(root);
            printf("\n");
        } else if (strcmp(command, "postorder") == 0) {
            printf(" Printing post-order\n");
            printPostOrder(root);
            printf("\n");
        } else if (strcmp(command, "levelorder") == 0) {
            printf(" Printing level-order\n");
            printLevelOrder(root);
            printf("\n");
        } else if (strcmp(command, "exit") == 0) {
            printf(" Exiting program\n");  
            break;
        } else {
            printWarning(" Enter a valid command\n");
        }
    }
    freeTree(root);
    return 0;
}
