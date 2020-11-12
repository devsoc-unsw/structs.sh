#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <string.h>
#include "heap.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"
#include "../util/menu-interface.h"

#define DEFAULT_NUM_SLOTS 10
#define MAX_SLOTS 100

/**
 * Prints command line usage info
 */
void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s --min|--max <num vertices>|<filename>\n", argv[0]);
	exit(1);
}

/**
 * Given the heap and the command string, extracts arguments from the command
 * and calls the relevant function.
 */
Heap processCommand(Heap heap, char *command, int heapType) {
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
            printHorizontalRule();
        }
    } else if (strcmp(commandName, "show") == 0) {
        // Format: show
        if (numArgs != 1) {
            printInvalidCommand("Show command format: show\n");
        } else {
            printf(" ➤ Showing the heap array\n");  
            printHeap(heap);
        }
    } else if (strcmp(commandName, "insert") == 0) {
        // Format: insert <d>
        if (numArgs < 2) {
            printInvalidCommand("Insert command format: insert <d>\n");
        } else {
            for (int i = 0; i < numArgs - 1; i++) {
                if (!isNumeric(tokens[i + 1])) {
                    printColoured("red", "%s is not numeric. Skipping\n", tokens[i + 1]);
                } else {
                    insertHeap(heap, atoi(tokens[i + 1]), heapType);
                }
            }
        }
    } else if (strcmp(commandName, "pop") == 0) {
        // Format: pop
        if (numArgs != 1) {
            printInvalidCommand("Pop command format: pop\n");
        } else {
            Item poppedValue = popHeap(heap, heapType);
            if (poppedValue == EMPTY) {
                printColoured("red", " ➤ No elements remaining in the heap\n");
            } else {
                printColoured("green", " ➤ Element with the highest priority is: %d\n", poppedValue);
            }
        }
    } else if (strcmp(commandName, "clear") == 0) {
		// Format: clear
        if (numArgs != 1) {
            printInvalidCommand("Clear command format: clear\n");
        } else {
            while (!heapIsEmpty(heap)) {
                popHeap(heap, heapType);
            }
        }
    } else if (strcmp(commandName, "popall") == 0) {
		// Format: popall
        if (numArgs != 1) {
            printInvalidCommand("Popall command format: popall\n");
        } else {
            if (heapIsEmpty(heap)) printColoured("red", " ➤ Heap is empty. Nothing to pop\n");
            else {
                printColoured("green", " ➤ Values in order of descending priority: ");
                Item poppedValue = popHeap(heap, heapType);
                printf("%d", poppedValue);
                while (!heapIsEmpty(heap)) {
                    Item poppedValue = popHeap(heap, heapType);
                    if (poppedValue != EMPTY) printf(", %d", poppedValue);
                }
                printf("\n");
            }
        }
    } else if (strcmp(commandName, "exit") == 0) {
		// Format: exit
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
			dropHeap(heap);
			freeTokens(tokens);
            returnToMenu();
        }
    } else {
        printInvalidCommand("Unknown command\n");
    }
    freeTokens(tokens);
    return heap;
}

int main(int argc, char *argv[]) {
    int size = DEFAULT_NUM_SLOTS;
    if (argc < 2) {
        printf("Insufficient arguments\n");
        printUsagePrompt(argv);
    }

    int heapType = MAX_HEAP;
    if (strcmp(argv[1], "--max") == 0) {
        heapType = MAX_HEAP;
    } else if (strcmp(argv[1], "--min") == 0) {
        heapType = MIN_HEAP;
    } else {
        printf("Invalid heap type specified\n");
        printUsagePrompt(argv);
    }

    if (argc == 3) {
        if (!isNumeric(argv[2])) printUsagePrompt(argv);
        size = atoi(argv[2]);
        if (size > MAX_SLOTS) {
            printColoured("red", "Size %d is too large, sorry. Try %d and below\n", size, MAX_SLOTS);
            exit(1);
        } else if (size < 0) {
            printColoured("red", "Size %d can't be negative\n", size, MAX_SLOTS);
            exit(1);
        }
    } else {
    } 

    printCommands();
    printHorizontalRule();
    Heap heap = newHeap(size);
	char line[MAX_LINE];
	while (1) {
        printPrompt("Enter command");
		fgets(line, MAX_LINE, stdin);
		// Ignore processing empty strings
        if (notEmpty(line)) {
            heap = processCommand(heap, line, heapType);
        }
    }
	dropHeap(heap);
	return 0;
}
