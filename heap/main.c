#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "heap.h"
#include "../util/colours.h"

#define MAX_LINE 127
#define DEFAULT_NUM_SLOTS 10

/**
 * Prints command line usage info
 */
void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s <num vertices>|<filename>\n", argv[0]);
	exit(1);
}

/**
 * Prints supported commands available in interactive mode
 */
void printCommands() {
	char *helpLog = "|===== Commands =====|\n"
                    " ===>  help                 - show available commands\n"
                    " ===>  show                 - shows the heap\n"
                    " ===>  insert <d>           - inserts a new value into the heap\n"
                    " ===>  pop                  - inserts a new value into the heap\n"
                    " ===>  exit                 - quit program\n"
                    "|====================|\n";
    printf("%s", helpLog);
}

/**
 * Prints prompt for the next line of user input
 */
void printPrompt() {
	printSuccess("\n ===> Enter Command: ");
}

/**
 * Given the graph and the command string, extracts arguments from the command
 * and calls the relevant function.
 */
Heap processCommand(Heap heap, char *command) {
    if (strcmp(command, "help") == 0) { 
        printCommands();
    } else if (strcmp(command, "show") == 0) {
        printf("Showing the heap array (not meant to be ordered in value)\n");  
        printHeap(heap);
    } else if (strcmp(command, "insert") == 0) {
        int newVal = atoi(strtok(NULL, " "));  
        printf("Inserting %d\n", newVal);  
        insert(heap, newVal);
    } else if (strcmp(command, "pop") == 0) {
        printf("Element with the highest priority is: %d\n", pop(heap));
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        exit(0);
    } else {
        printFailure(" -> Enter a valid command\n");
    }
    return heap;
}

int main(int argc, char *argv[]) {
    int size = DEFAULT_NUM_SLOTS;
    if (argc > 1) {
        size = atoi(argv[1]);
    }

    Heap heap = newHeap(10);
	char line[MAX_LINE];
	printCommands();
	while (1) {
		printPrompt();
		fgets(line, MAX_LINE, stdin);
        printWarning(" You entered: ");
        printPrimary(line);
        // Strips trailing newline character and whitespace
        strtok(line, "\n");
        strtok(line, " ");
        processCommand(heap, line);
    }
	return 0;
}
