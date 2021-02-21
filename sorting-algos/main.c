#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <time.h>
#include <limits.h>
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
 * Generates a random input sequence with the given size.
 * Assumes the input array has enough memory allocated to support the 
 * given size
 */
void generateRandomSequence(int *array, int size, int maxValue) {
    srand(time(0));
    for (int i = 0; i < size; i++) array[i] = rand() % maxValue + 1;
}

/**
 * Given the original array, its size and a command string, determines
 * which function to call. Returns the time spent by that function
 */
double processCommand(int *array, int *size, char *command, bool suppressOutput) {
    char **tokens = tokenise(command);
    char *commandName = tokens[0];
    int numArgs = getNumTokens(tokens);
    char *token = commandName;

    // Cloning the unsorted array
    int *copy = malloc(sizeof(int) * (*size));
    for (int i = 0; i < (*size); i++) copy[i] = array[i];

    // Starting the timer
    clock_t begin = clock();
    clock_t end = 0;
    double timeSpent = NO_TIME;
    
    if (numArgs <= 0) {
    } else if (!commandName) {
        printInvalidCommand("Enter a valid command\n");
    } else if (strcmp(commandName, "help") == 0) { 
        // Format: help
        if (numArgs != 1) {
            printInvalidCommand("Help command format: help\n");
        } else {
            printCommands();
        }
    } else if (strcmp(commandName, "input") == 0) {
        // Format: input <space separated integers>
        if (numArgs < 1) {
            printInvalidCommand("Input command format: input <space separated integers>. Eg. input 4 5 1 7 3 6 9\n");
        } else {
            if (!suppressOutput) {
                bool invalidInput = false;
                for (int i = 1; i < numArgs; i++) {
                    if (!isNumeric(tokens[i])) {
                        printColoured("red", "%s is not numeric. Try again\n", tokens[i]);
                        invalidInput = true;
                        break;
                    } 
                }
                if (!invalidInput) {
                    int successfullyInputted = 0;
                    for (int i = 1; i < numArgs; i++) {
                        array[successfullyInputted] = atoi(tokens[i]); 
                        successfullyInputted++;
                    }
                    *size = successfullyInputted;
                    printColoured("blue", "Input array: ");
                    showArray(array, *size);
                    printColoured("green", "New size: %d\n", *size);
                }
            }
        }
    } else if (strcmp(commandName, "randomised") == 0 ||
               strcmp(commandName, "reversed") == 0 ||
               strcmp(commandName, "sorted") == 0) {
        // Format: randomise <size> <maxValue>
        if (numArgs != 3) {
            if (strcmp(commandName, "randomised") == 0) 
                printInvalidCommand("Randomised command format: randomised <size> <maxValue>. Eg. randomised 25 50\n");
            if (strcmp(commandName, "reversed") == 0) 
                printInvalidCommand("Reversed command format: reversed <size> <maxValue>. Eg. reversed 30 30\n");
            if (strcmp(commandName, "sorted") == 0) 
                printInvalidCommand("Sorted command format: sorted <size> <maxValue>. Eg. sorted 100 75\n");       
        } else {
            if (!isNumeric(tokens[1])) {
                printColoured("red", "%s is not numeric. Try again\n", tokens[1]);
            } else if (!isNumeric(tokens[2])) {
                printColoured("red", "%s is not numeric. Try again\n", tokens[2]);
            } else {
                int seqSize = atoi(tokens[1]);
                int maxValue = atoi(tokens[2]);
                if (seqSize < 0) {
                    printColoured("red", "%d must not be negative\n", seqSize);
                } else if(seqSize > MAX_NUMS) {
                    printColoured("red", "%d is too large. Try below %d\n", seqSize, MAX_NUMS);
                } else if (maxValue < 0) {
                    printColoured("red", "%d must not be negative\n", maxValue);
                } else {
                    generateRandomSequence(array, seqSize, maxValue);
                    *size = seqSize;
                    if (strcmp(commandName, "reversed") == 0) {
                        shellSort(array, 0, *size);
                        reverseSorted(array, *size);
                    } else if (strcmp(commandName, "sorted") == 0) {
                        shellSort(array, 0, *size);
                    }
                    showArray(array, *size);
                }
            }
        }
    } else if (strcmp(commandName, "show") == 0) {
        // Format: show
        if (numArgs != 1) {
            printInvalidCommand("Show command format: show\n");
        } else {
            if (!suppressOutput) {
                printColoured("blue", "Input array: ");
                showArray(copy, *size);
                printColoured("green", "Size: %d\n", *size);
            }
        }
    } else if (strcmp(commandName, SELECTION_SORT) == 0) {
        // Format: selectionsort
        if (numArgs != 1) {
            printInvalidCommand("Selection sort command format: selectionsort\n");
        } else {
            selectionSort(copy, 0, *size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, *size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, INSERTION_SORT) == 0) {
        // Format: insertionsort
        if (numArgs != 1) {
            printInvalidCommand("Insertion sort command format: insertionsort\n");
        } else {
            insertionSort(copy, 0, *size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, *size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, BUBBLE_SORT) == 0) {
        // Format: bubblesort
        if (numArgs != 1) {
            printInvalidCommand("Bubble sort command format: bubblesort\n");
        } else {
            bubbleSort(copy, 0, *size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, *size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, SHELL_SORT) == 0) {
        // Format: shellsort
        if (numArgs != 1) {
            printInvalidCommand("Shell sort command format: shellsort\n");
        } else {
            shellSort(copy, 0, *size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, *size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, QUICK_SORT) == 0) {
        // Format: quicksort
        if (numArgs != 1) {
            printInvalidCommand("Quicksort command format: quicksort\n");
        } else {
            quicksort(copy, 0, *size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, *size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, MERGE_SORT) == 0) {
        // Format: mergesort
        if (numArgs != 1) {
            printInvalidCommand("Merge sort command format: mergesort\n");
        } else {
            mergesort(copy, 0, *size - 1);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, *size);
            }
            end = clock();
            timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
        }
    } else if (strcmp(commandName, HEAP_SORT) == 0) {
        // Format: heapsort
        if (numArgs != 1) {
            printInvalidCommand("Heap sort command format: heapsort\n");
        } else {
            heapsort(copy, 0, *size);
            if (!suppressOutput) {
                printColoured("blue", "Sorted array: ");
                showArray(copy, *size);
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
}

int main(int argc, char *argv[]) {
    char *filename = NULL;
    bool suppressOutput = false;
    int array[MAX_NUMS];
    int size = 0;
    if (argc < 2) {
        size = 25;
        generateRandomSequence(array, size, 50);
    } else {
        if (strcmp(argv[1], "-s") == 0 || strcmp(argv[1], "--silent") == 0) {
            if (argc < 3) printUsagePrompt(argv);
            suppressOutput = true;
            filename = argv[2];
        } else {
            filename = argv[1];
        }

        FILE *inputFile = fopen(filename, "r");
        char line[MAX_LINE];
        while (fgets(line, MAX_LINE, inputFile) != NULL) {
            int num;
            if (sscanf(line, "%d", &num) != 1) {
                fprintf(stderr, "Error reading: %s\n", line);
                exit(1);
            }
            array[size] = num;
            size++;
            if (size >= MAX_NUMS) {
                printColoured("red", "Too many inputs. Size of the array must be smaller than 50000, sorry.");
                exit(1);
            }
        }
    }
    
    printCommands();
    printHorizontalRule();
    if (!suppressOutput) {
        printColoured("blue", "Current array: ");
        showArray(array, size);
    }
    char *command = malloc(sizeof(char) * MAX_COMMAND_SIZE);

	while (1) {
		printPrompt("Enter command");
		command = fgets(command, MAX_LINE, stdin);
        // Ignore processing empty strings
        if (notEmpty(command)) {
            double timeSpent = processCommand(array, &size, command, suppressOutput);
            if (!(timeSpent < NO_TIME_THRESHOLD)) printColoured("green", "Took: %lf seconds to compute\n", timeSpent);
        }
    }
	return 0;
}

