#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <time.h>
#include "sort.h"
#include "../heap/heap.h"
#include "../util/menu-interface.h"
#include "../util/display/display.h"
#include "../util/utilities/processing.h"

#define MAX_NUMS 50000
#define MAX_LINE 256
#define MAX_COMMAND_SIZE 64

#define SELECTION_SORT "selectionsort"
#define INSERTION_SORT "insertionsort"
#define BUBBLE_SORT    "bubblesort"
#define SHELL_SORT     "shellsort"
#define QUICK_SORT     "quicksort"
#define MERGE_SORT     "mergesort"
#define HEAP_SORT      "heapsort"
#define RUN_ALL        "runall"

#define NO_TIME -1.0
#define NO_TIME_THRESHOLD 0.0

/**
 * Given the original array, its size and a command string, determines
 * which function to call. Returns the time spent by that function
 */
double processCommand(int *a, int size, char *command, bool suppressOutput) {
    char **tokens = tokenise(command);
    char *commandName = tokens[0];
    int numArgs = getNumTokens(tokens);
    char *token = commandName;

    // Cloning the unsorted array
    int *copy = malloc(sizeof(int) * size);
    for (int i = 0; i < size; i++) copy[i] = a[i];

    // Starting the timer
    clock_t begin = clock();
    clock_t end = 0;
    double timeSpent = 0;
    
    if (numArgs <= 0) {
    } else if (!commandName) {
        printInvalidCommand("Enter a valid command\n");
    } else if (strcmp(commandName, "help") == 0) { 
        // Format: help
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
            printCommands();
            timeSpent = NO_TIME;
        }
    } else if (strcmp(commandName, SELECTION_SORT) == 0) {
        // Format: selectionsort
        if (numArgs != 1) {
            printInvalidCommand("Selection sort command format: selectionsort\n");
        } else {
            selectionSort(copy, 0, size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, INSERTION_SORT) == 0) {
        // Format: insertionsort
        if (numArgs != 1) {
            printInvalidCommand("Insertion sort command format: insertionsort\n");
        } else {
            insertionSort(copy, 0, size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, BUBBLE_SORT) == 0) {
        // Format: bubblesort
        if (numArgs != 1) {
            printInvalidCommand("Bubble sort command format: bubblesort\n");
        } else {
            bubbleSort(copy, 0, size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, SHELL_SORT) == 0) {
        // Format: shellsort
        if (numArgs != 1) {
            printInvalidCommand("Shell sort command format: shellsort\n");
        } else {
            shellSort(copy, 0, size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, QUICK_SORT) == 0) {
        // Format: quicksort
        if (numArgs != 1) {
            printInvalidCommand("Quicksort command format: quicksort\n");
        } else {
            quicksort(copy, 0, size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, MERGE_SORT) == 0) {
        // Format: mergesort
        if (numArgs != 1) {
            printInvalidCommand("Merge sort command format: mergesort\n");
        } else {
            mergesort(copy, 0, size - 1);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, HEAP_SORT) == 0) {
        // Format: heapsort
        if (numArgs != 1) {
            printInvalidCommand("Heap sort command format: heapsort\n");
        } else {
            heapsort(copy, 0, size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, "runall") == 0) {
        // Recursively processing each sort command
        double selectionSortTime = processCommand(copy, size, SELECTION_SORT, true);
        double insertionSortTime = processCommand(copy, size, INSERTION_SORT, true);
        double bubbleSortTime = processCommand(copy, size, BUBBLE_SORT, true);
        double shellSortTime = processCommand(copy, size, SHELL_SORT, true);
        double quickSortTime = processCommand(copy, size, QUICK_SORT, true);
        double mergeSortTime = processCommand(copy, size, MERGE_SORT, true);
        double heapSortTime = processCommand(copy, size, HEAP_SORT, true);
        printf(" ➤ Selection sort : %lf seconds\n", selectionSortTime);
        printf(" ➤ Insertion sort : %lf seconds\n", insertionSortTime);
        printf(" ➤ Bubble sort    : %lf seconds\n", bubbleSortTime);
        printf(" ➤ Shell sort     : %lf seconds\n", shellSortTime);
        printf(" ➤ Quick sort     : %lf seconds\n", quickSortTime);
        printf(" ➤ Merge sort     : %lf seconds\n", mergeSortTime);
        printf(" ➤ Heap sort      : %lf seconds\n", heapSortTime);
        timeSpent += selectionSortTime + insertionSortTime + 
            bubbleSortTime + shellSortTime + quickSortTime + 
            mergeSortTime + heapSortTime;
    } else if (strcmp(commandName, "exit") == 0) {
        // Format: exit
        if (numArgs != 1) {
            printInvalidCommand("Exit command format: exit\n");
        } else {
            free(copy);
			freeTokens(tokens);
            returnToMenu();
        }
    } else {
        printInvalidCommand("Unknown command: %s\n", commandName);
    }

    freeTokens(tokens);
    free(copy);
    return timeSpent;
}

/**
 * Prints command line usage info
 */
void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s [options] <filename>\n", argv[0]);
	fprintf(stderr, "    -s, --silent : suppresses sequence output\n");
    exit(1);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printUsagePrompt(argv);
    }
    char *filename = NULL;
    bool suppressOutput = false;
    if (strcmp(argv[1], "-s") == 0 || strcmp(argv[1], "--silent") == 0) {
        if (argc < 3) printUsagePrompt(argv);
        printf("Suppressing output\n");
        suppressOutput = true;
        filename = argv[2];
    } else {
        filename = argv[1];
    }
    int a[MAX_NUMS];
    FILE *inputFile = fopen(filename, "r");
    char line[MAX_LINE];
    int size = 0;
    while (fgets(line, MAX_LINE, inputFile) != NULL) {
        int num;
        if (sscanf(line, "%d", &num) != 1) {
            fprintf(stderr, "Error reading: %s\n", line);
            exit(1);
        }
        a[size] = num;
        size++;
    }
    
    printCommands();
    printHorizontalRule();
    if (!suppressOutput) {
        printColoured("blue", "Original array: ");
        showArray(a, size);
    }
    char *command = malloc(sizeof(char) * MAX_COMMAND_SIZE);

	while (1) {
		printPrompt("Enter command");
		command = fgets(command, MAX_LINE, stdin);
        // Ignore processing empty strings
        if (notEmpty(command)) {
            double timeSpent = processCommand(a, size, command, suppressOutput);
            if (!(timeSpent < NO_TIME_THRESHOLD)) printColoured("green", "Took: %lf seconds to compute\n", timeSpent);
        }
    }
	return 0;
}

