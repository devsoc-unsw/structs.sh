#include <stdio.h>
#include <stdlib.h>
#include <stdbool.h>
#include "sort.h"
#include "../heap/heap.h"
#include "../util/display/display.h"

/**
 * ===== Selection Sort =====
 * Sorted segment grows from left to right
 * 1. Find the smallest element in the unsorted segment
 * 2. Put it at the end of the sorted segment
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
 * 1. Pick the first value in the unsorted segment
 * 2. Put this value in the right place in the sorted segment by repeatedly swapping
 *    with its left neighbour
 * 3. Repeat n times 
 * 
 * Time complexity:    O(n^2) 
 * Can it be stable:   yes
 * Can it be adaptive: yes - if we stop when we've found the insertion point
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
 * 5. Continuing on, up to a[n] will 'bubble' the largest value to the right
 * 6. Repeating n times will 'bubble' all elements to the right place
 * 
 * Time complexity:    O(n^2) 
 * Can it be stable:   yes
 * Can it be adaptive: yes - if we stop when there were no swaps made in one full loop
 */
void bubbleSort(int *a, int lo, int hi) {
    for (int i = lo; i < hi; i++) {
        // The next for loop 'bubbles' the largest element to the right
        int swapsThisLoop = 0;
        for (int j = lo; j < hi - 1; j++) {
            if (a[j] > a[j + 1]) {
                swap(a, j, j + 1);
                swapsThisLoop++;
            }
        }
        if (swapsThisLoop == 0) return;
    }
}

/**
 * ===== Shell Sort =====
 * 1. Pick the first h-value - this will be the interval size
 * 2. For every element which is h positions away from each other, use insertion sort on those elements.
 *    Do this for every possible group of elements that are h positions away (so shift 1 index forward
 *    once you are done with the current group of elements).
 *     -> Best to just see an animation on this: https://www.cs.usfca.edu/~galles/visualization/ComparisonSort.html
 * 3. Repeat step 2 for every h value. The last value should be h = 1, where we're just doing regular
 *    insertion sort
 * 
 * Time complexity:    O(n^2) - but for some particular sequences of h-values you can achieve O(n^(3/2)), for example
 * Can it be stable:   nope
 * Can it be adaptive: yes
 */
void shellSort(int *a, int lo, int hi) {
    int hVals[8] = {701, 302, 132, 57, 23, 10, 4, 1};
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
 * 3. Recursively call quicksort(lo, pivotIndex), quicksort(pivotIndex + 1, hi)
 * 
 * Time complexity:    O(n^2)  
 * Can it be stable:   not without O(n) space complexity, which isn't common
 * Can it be adaptive: depends on the choice of the pivot
 */
void quicksort(int *a, int lo, int hi) {
    if (hi <= lo) return;
    int pivotIndex = partition(a, lo, hi - 1);
    quicksort(a, lo, pivotIndex);
    quicksort(a, pivotIndex + 1, hi);
}

/**
 * Selects a pivot element in the given array and returns its index.
 * Puts all values LESS    than the pivot on the LEFT  of the pivot.
 * Puts all values GREATER than the pivot on the RIGHT of the pivot
 */
static int partition(int *a, int lo, int hi) {
    // Just picking the first element as the pivot
    int pivot = a[lo];
    int leftIndex = lo + 1; 
    int rightIndex = hi;

    while (1) {
        // Moving the leftIndex scanner forward until we reach a value greater than the pivot
        for (; leftIndex <= hi; leftIndex++)
            if (a[leftIndex] > pivot) break;
        // Moving the rightIndex scanner backward until we reach a value less than the pivot
        for (; rightIndex >= lo + 1; rightIndex--)
            if (a[rightIndex] < pivot) break;
        // Partitioning is done when the left scanner and right scanners cross over
        if (leftIndex >= rightIndex) break;
        swap(a, leftIndex, rightIndex);
    }
    swap(a, rightIndex, lo);
    return rightIndex;
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
    if (hi <= lo) return;
    int midpoint = (lo + hi) / 2;
    mergesort(a, lo, midpoint);
    mergesort(a, midpoint + 1, hi);
    merge(a, lo, midpoint, hi);
}

/**
 * Merging the array values lo to mid and mid to hi into a single sorted 
 * array.  
 */
static void merge(int *a, int lo, int mid, int hi) {
    int *tmp = malloc(sizeof(int) * (hi - lo + 1));
    int i = lo;
    int j = mid + 1;
    int k = 0;
    // Merging the two halves (until you exhaust one of the halves)
    while (i <= mid && j <= hi) {
        if (a[i] < a[j]) {
            tmp[k] = a[i];
            i++;
        } else {
            tmp[k] = a[j];
            j++;
        }
        k++;
    }
    // Copy over the remaining values into the tmp array
    while (i <= mid) {
        tmp[k] = a[i];
        i++;
        k++;
    }
    while (j <= hi) {
        tmp[k] = a[j];
        j++;
        k++;
    }
    // Copy tmp into the original array
    for (int i = lo, k = 0; i <= hi; i++, k++) {
        a[i] = tmp[k];
    }
    free(tmp);
}

/**
 * ===== Heapsort =====
 * 1. Construct a heap by inserting each value in the unsorted aray
 * 2. Repeatedly pop the heap n times, storing each value in the original array
 *    Note: popping the heap gives you the highest value each time
 * 
 * Time complexity:    O(nlogn) 
 * Can it be stable:   no
 * Can it be adaptive: yes - some variants perform better on partially/fully sorted inputs
 */
void heapsort(int *a, int lo, int hi) {
    int size = hi - lo + 1;
    // Building the heap by feeding in the unsorted values one by one
    Heap heap = newHeap(size);
    for (int i = lo; i < hi; i++) {
        insertHeap(heap, a[i], MAX_HEAP);
    }
    // Repeatedly popping the root of the heap gives you elements in sorted order
    for (int i = hi - 1; i >= lo; i--) {
        a[i] = popHeap(heap, MAX_HEAP);
    }
}

// ===== Utilities =====

/**
 * Checks if the array is sorted in ascending order
 */
bool isSorted(int a[], int lo, int hi) {
    for (int i = lo; i < hi; i++) {
        if (!(a[i] < a[i + 1])) {
            printf("UNSORTED PAIR %d, %d\n", a[i], a[i+1]);
            return false;
        }
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
 * Prints the array's elements. If there are more than 100 elements, then only print
 * the first 50 and last 50 elements.
 */
void showArray(int *a, int size) {
    if (size > 100) {
        printColoured("red", "More than 100 numbers. Showing first 50 and last 50 numbers\n");
        for (int i = 0; i < 50; i++) printf("%d ", a[i]);
        printf("... ");
        for (int i = size - 50; i < size; i++) printf("%d ", a[i]);
    } else {
        for (int i = 0; i < size; i++) printf("%d ", a[i]);
    }
    printf("\n");
}

void reverseSorted(int *a, int size) {
    for (int i = 0; i < size / 2; i++) {
        int tmp = a[i];
        a[i] = a[size - 1 - i];
        a[size - 1 - i] = tmp;
    }
}
