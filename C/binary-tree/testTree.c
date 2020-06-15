#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "../util/colours.h"
#include "tree-print.h"
#include "tree.h"

#define MAX_COMMAND_SIZE 64

void printCommands() {
    char *helpLog = " ===>  exit       - quit program\n"
                    " ===>  left       - perform a left rotation\n"
                    " ===>  right      - perform a right rotation\n"
                    " ===>  insert <d> - \n"
                    " ===>  del <d>    -";
    printf("%s", helpLog);
}

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
    do {
        printSuccess("|===== Tree State =====|\n");
        printTree(root);
        printSuccess("|======================|\n");
        printCommands();
        command = fgets(command, MAX_COMMAND_SIZE, stdin);
        strtok(command, "\n");
        printf("You entered %s\n", command);
    }
    while (strcmp(command, "exit") != 0);
    return 0;
}
