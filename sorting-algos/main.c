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
                    " ===>  exit                 - quit program\n"
                    "|====================|\n";
    printf("%s", helpLog);
}

void processCommand(int *a, int size, char *command) {
    int *copy = malloc(sizeof(int) * size);
    for (int i = 0; i < size; i++) {
        copy[i] = a[i];
    }
    clock_t begin = clock();

    if (strcmp(command, "help") == 0) { 
        printCommands();
        free(copy);
        return;
    } else if (strcmp(command, "selectionsort") == 0) {
        selectionSort(copy, 0, size);
    } else if (strcmp(command, "insertionsort") == 0) {
        insertionSort(copy, 0, size);
    } else if (strcmp(command, "bubblesort") == 0) {
        bubbleSort(copy, 0, size);
    } else if (strcmp(command, "shellsort") == 0) {
        shellSort(copy, 0, size);
    } else if (strcmp(command, "quicksort") == 0) {
        quicksort(copy, 0, size);
    } else if (strcmp(command, "mergesort") == 0) {
        mergesort(copy, 0, size - 1);
    } else if (strcmp(command, "heapsort") == 0) {
        heapsort(copy, 0, size);
    } else if (strcmp(command, "exit") == 0) {
        printf(" -> Exiting program :)\n");  
        exit(0);
    }  else {
        printFailure(" -> Enter a valid command\n");
        free(copy);
        return;
    }

    clock_t end = clock();
    double timeSpent = (double)(end - begin) / CLOCKS_PER_SEC;
    printSuccess("Sorted array:   ");
    showArray(copy, size);
    printf("Took: %lf seconds\n", timeSpent);
    free(copy);
}

/**
 * Prints command line usage info
 */
void printUsagePrompt(char *argv[]) {
	fprintf(stderr, "Usage: %s <filename>\n", argv[0]);
	exit(1);
}

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printUsagePrompt(argv);
    }
    int a[MAX_NUMS];
    FILE *inputFile = fopen(argv[1], "r");
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
    printPrimary("Original array: ");
    showArray(a, size);
	while (1) {
		printPrompt();
		fgets(line, MAX_LINE, stdin);
        printWarning(" You entered: ");
        printPrimary(line);
        // Strips trailing newline character and whitespace
        strtok(line, "\n");
        strtok(line, " ");
        processCommand(a, size, line);
    }
	return 0;
}

