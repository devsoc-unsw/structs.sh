#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include <string.h>
#include <time.h>
#include "sort.h"
#include "../heap/heap.h"
#include "../util/colours.h"

#define MAX_NUMS 50000
#define MAX_LINE 256

#define SELECTION_SORT "selectionsort"
#define INSERTION_SORT "insertionsort"
#define BUBBLE_SORT "bubblesort"
#define SHELL_SORT "shellsort"
#define QUICK_SORT "quicksort"
#define MERGE_SORT "mergesort"
#define HEAP_SORT "heapsort"
#define RUN_ALL "runall"

/**
 * Prints prompt for the next line of user input
 */
void printPrompt() {
	printSuccess("\n ===> Enter Command: ");
}


/**
 * Prints supported commands available in interactive mode
 */
void printCommands() {
	char *helpLog = "|===== Commands =====|\n"
                    " ===>  help                 - show available commands\n"
                    " ===>  selectionsort        - executes selection sort\n"
                    " ===>  insertionsort        - executes insertion sort\n"
                    " ===>  bubblesort           - executes bubble sort\n"
                    " ===>  shellsort            - executes shellsort\n"
                    " ===>  quicksort            - executes quicksort\n"
                    " ===>  mergesort            - executes mergesort\n"
                    " ===>  heapsort             - executes heapsort\n"
                    " ===>  runall               - executes all sorting algorithms\n"
                    " ===>  exit                 - quit program\n"
                    "|====================|\n";
    printf("%s", helpLog);
}

/**
 * Given the original array, its size and a command string, determines
 * which function to call. Returns the time spent by that function
 */
double processCommand(int *a, int size, char *command) {
    int *copy = malloc(sizeof(int) * size);
    for (int i = 0; i < size; i++) {
        copy[i] = a[i];
    }
    clock_t begin = clock();

    if (strcmp(command, "help") == 0) { 
        printCommands();
        free(copy);
        return 0;
    } else if (strcmp(command, SELECTION_SORT) == 0) {
        selectionSort(copy, 0, size);
    } else if (strcmp(command, INSERTION_SORT) == 0) {
        insertionSort(copy, 0, size);
    } else if (strcmp(command, BUBBLE_SORT) == 0) {
        bubbleSort(copy, 0, size);
    } else if (strcmp(command, SHELL_SORT) == 0) {
        shellSort(copy, 0, size);
    } else if (strcmp(command, QUICK_SORT) == 0) {
        quicksort(copy, 0, size);
    } else if (strcmp(command, MERGE_SORT) == 0) {
        mergesort(copy, 0, size - 1);
    } else if (strcmp(command, HEAP_SORT) == 0) {
        heapsort(copy, 0, size);
    } else if (strcmp(command, "runall") == 0) {
        // Recursively processing each sort command
        double totalTimeSpent = 0;
        double selectionSortTime = processCommand(copy, size, SELECTION_SORT);
        double insertionSortTime = processCommand(copy, size, INSERTION_SORT);
        double bubbleSortTime = processCommand(copy, size, BUBBLE_SORT);
        double shellSortTime = processCommand(copy, size, SHELL_SORT);
        double quickSortTime = processCommand(copy, size, QUICK_SORT);
        double mergeSortTime = processCommand(copy, size, MERGE_SORT);
        double heapSortTime = processCommand(copy, size, HEAP_SORT);
        printf("Selection sort: %lf seconds\n", selectionSortTime);
        printf("Insertion sort: %lf seconds\n", insertionSortTime);
        printf("Bubble sort   : %lf seconds\n", bubbleSortTime);
        printf("Shell sort    : %lf seconds\n", shellSortTime);
        printf("Quick sort    : %lf seconds\n", quickSortTime);
        printf("Merge sort    : %lf seconds\n", mergeSortTime);
        printf("Heap sort     : %lf seconds\n", heapSortTime);
        totalTimeSpent += selectionSortTime + insertionSortTime + bubbleSortTime + shellSortTime + quickSortTime + mergeSortTime + heapSortTime;
        return totalTimeSpent;
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        exit(0);
    } else {
        printFailure(" -> Enter a valid command\n");
        free(copy);
        return 0;
    }

    clock_t end = clock();
    double timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
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
    if (!suppressOutput) {
        printPrimary("Original array: ");
        showArray(a, size);
    }
	while (1) {
		printPrompt();
		fgets(line, MAX_LINE, stdin);
        printWarning(" You entered: ");
        printPrimary(line);
        // Strips trailing newline character and whitespace
        strtok(line, "\n");
        strtok(line, " ");
        double timeSpent = processCommand(a, size, line);
        if (!suppressOutput) {
            printPrimary("Sorted array: ");
            showArray(a, size);
        }
        printf("Took: %lf seconds\n", timeSpent);
    }
	return 0;
}

