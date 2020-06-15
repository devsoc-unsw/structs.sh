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
                    " ===>  insert <d>  - perform a right rotation on node with value <d>\n"
                    " ===>  delete <d>  - perform a right rotation on node with value <d>\n"
                    " ===>  ";
    printf("%s", helpLog);
}

// TODO: CAN'T HANDLE DUPLICATES!!!
int main(int argc, char *argv[]) {
    if (argc < 2) {
        fprintf(stderr, "Usage: %s <space separated integers> \n", argv[0]);
        exit(1);
    }

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
            insert(root, val);
        } else if (strcmp(command, "delete") == 0) {
            int val = atoi(strtok(NULL, " "));  
            printf(" Deleting %d\n", val);
            delete(root, val);
        } else if (strcmp(command, "exit") == 0) {
            printf(" Exiting program\n");  
            break;
        } else {
            printf(" Enter a valid command\n");
        }
    }
    freeTree(root);
    return 0;
}
