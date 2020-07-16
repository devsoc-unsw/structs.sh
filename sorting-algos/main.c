#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "sort.h"
#include "../heap/heap.h"

int main(int argc, char *argv[]) {
    // FILE *inputFile = fopen(argv[1], "r");
    // char line[256];
    // while (fgets(line, MAX_LINE, inputFile) != NULL) {
    //     if (sscanf(line, "%d", &num) != 1) {
    //         fprintf("Error reading: %s\n", line);
    //     }
    // }
    
    int size = argc - 1;
    int a[size];
    for (int i = 1; i < argc; i++) {
        a[i - 1] = atoi(argv[i]);
    }

    printf("Original array: ");
    showArray(a, size);

    // selectionSort(a, 0, size);
    // insertionSort(a, 0, size);
    // bubbleSort(a, 0, size);
    // shellSort(a, 0, size);
    // quicksort(a, 0, size);
    // mergesort(a, 0, size);
    heapsort(a, 0, size);

    printf("Sorted array:   ");
    showArray(a, size);
    return 0;
}

