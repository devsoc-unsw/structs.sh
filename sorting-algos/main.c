#include <stdio.h>
#include <stdbool.h>
#include "sort.h"

/**
 * ===== Selection Sort =====
 * Sorted segment grows from left to right
 * 1. Find the smallest element
 * 2. Put it at the start
 * 3. Repeat n times 
 * 
 * Time complexity:    O(n^2) 
 * Can it be stable:   yes 
 * Can it be adaptive: nope
 */
void selectionSort(int *a, int lo, int hi) {
    for (int i = lo; i < hi; i++) {
        // Loop through every element in the unsorted segment and pick the smallest one 
        int minIndex = i;
        for (int j = i + 1; j < hi; j++) {
            if (a[j] < a[minIndex]) minIndex = j;
        }
        // Put that smallest element in the right place in the sorted segment by swapping with i
        swap(a, i, minIndex);
    }
}


/**
 * ===== Insertion Sort =====
 * Sorted segment grows from left to right
 * 1. Pick the leftmost value in the unsorted segment
 * 2. Put this value in the right place in the sorted segment by repeatedly swapping
 *    with its left neighbour
 * 3. Repeat n times 
 * 
 * Time complexity:    O(n^2) 
 * Can it be stable:   yes
 * Can it be adaptive: yes - if we stop when we've found the insertion point (TODO)
 */
void insertionSort(int *a, int lo, int hi) {
    for (int i = lo; i < hi - 1; i++) {
        // Pick the first element in the unsorted segment and 'bubble' it leftwards into the right place
        // in the sorted segment
        int j = i + 1;
        while (j >= 0 && a[j] < a[j - 1]) {
            swap(a, j, j - 1);
            j--;
        }
    }
}

/**
 * ===== Bubble Sort =====
 * Sorted segment grows from right to left
 * 1. Pick the first 2 values on the left (a[0] and a[1])
 * 2. Swap them if a[0] is larger than a[1]
 * 3. Look at the next pair a[1] and a[2]
 * 4. Swap them if a[1] is larger than a[2]
 * 5. Repeating this will 'bubble' the largest value to the right
 * 6. Repeat n times to 'bubble' all elements to the right place
 * 
 * Time complexity:    O(n^2) 
 * Can it be stable:   yes
 * Can it be adaptive: yes - if we stop when there were no swaps made in one full loop
 */
void bubbleSort(int *a, int lo, int hi) {
    for (int i = lo; i < hi; i++) {
        // The next for loop 'bubbles' the largest element to the right
        for (int j = lo; j < hi - 1; j++) {
            if (a[j] > a[j + 1]) swap(a, j, j + 1);
        }
    }
}

/**
 * ===== Shell Sort =====
 * TODO
 */
void shellSort(int *a, int lo, int hi) {
    int hVals[8] = {701, 301, 132, 57, 23, 10, 4, 1};
    for (int g = 0; g < 8; g++) {
        int h = hVals[g];
        int start = lo + h;
        for (int i = start; i < hi; i++) {
            int val = a[i];
            int j;
            for (j = i; j >= start; j -= h) {
                if (!(val < a[j-h])) break;
                a[j] = a[j - h];
            }
            a[j] = val;
        }
    }
}

/**
 * ===== Quicksort =====
 * 1. Pick any element as a 'pivot' (usually the first element)
 * 2. Partition the other elements around the pivot so that every element to the left
 *    of the pivot is less than it and every element to the right is greater than it
 * 3. TODO
 * 
 * Time complexity:    O(n^2)  
 * Can it be stable:   not without O(n) space complexity, which isn't common
 * Can it be adaptive: depends on the choice of the pivot
 */
void quicksort(int *a, int lo, int hi) {
    if (hi <= lo) return;
    int pivotIndex = partition(a, lo, hi);
    quicksort(a, lo, pivotIndex);
    quicksort(a, pivotIndex + 1, hi);
}

static int partition(int *a, int lo, int hi) {
    
}

/**
 * ===== Mergesort =====
 * 1. Divide the array in half
 * 2. Call mergesort(firsthalf) and mergesort(secondhalf)
 * 3. Merge both sorted halves into a single sorted array
 * 
 * Time complexity:    O(nlogn) 
 * Can it be stable:   yes
 * Can it be adaptive: if it's top-down mergesort or bottom-up mergesort, then no
 */
void mergesort(int *a, int lo, int hi) {

}

/**
 * ===== Heapsort =====
 * 1. 
 * 
 * Time complexity:    O(nlogn) 
 * Can it be stable:   no
 * Can it be adaptive: yes - some variants perform better on partially/fully sorted inputs
 */
void heapsort(int *a, int lo, int hi) {

}

// ===== Utilities =====

/**
 * Checks if the array is sorted in ascending order
 */
bool isSorted(int a[], int lo, int hi) {
    for (int i = lo; i < hi; i++) {
        if (!(a[i] < a[i + 1])) return false;
    }
    return true;
}

/**
 * Swaps the contents of two array indexes
 */
void swap(int *a, int i, int j) {
    int tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
}

/**
 * Prints the array's elements
 */
void showArray(int *a, int size) {
    for (int i = 0; i < size; i++) {
        printf("%d ", a[i]);
    }
    printf("\n");
}


int main(int argc, char *argv[]) {
    int a[] = {5, 3, 7, 9, 10, 2, 3, 1};
    int size = 8;
    showArray(a, size);

    // selectionSort(a, 0, size);
    // insertionSort(a, 0, size);
    // bubbleSort(a, 0, size);
    shellSort(a, 0, size);

    showArray(a, size);

    return 0;
}





