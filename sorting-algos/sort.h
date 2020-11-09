#ifndef SORT_ALGOS
#define SORT_ALGOS

#include <stdbool.h>

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
void selectionSort(int *a, int lo, int hi);

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
void insertionSort(int *a, int lo, int hi);

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
void bubbleSort(int *a, int lo, int hi);

/**
 * ===== Shell Sort =====
 * 1. Pick the first h-value - this will be the interval size
 * 2. For each element which is h positions away from each other, use insertion sort on those elements.
 *    Do this for every possible group of elements that are h positions away (so shift 1 index forward).
 *    Best to see an animation on this: https://www.cs.usfca.edu/~galles/visualization/ComparisonSort.html
 * 3. Repeat step 2 for every h value. The last value should be h = 1, where we're just doing regular
 *    insertion sort
 * 
 * Time complexity:    O(n^2) - but for some particular sequences of h-values you can achieve O(n^(3/2)), for example
 * Can it be stable:   nope
 * Can it be adaptive: yes
 */
void shellSort(int *a, int lo, int hi);

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
void quicksort(int *a, int lo, int hi);
static int partition(int *a, int lo, int hi); 

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
void mergesort(int *a, int lo, int hi);
static void merge(int *a, int lo, int mid, int hi);

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
void heapsort(int *a, int lo, int hi);

// ===== Utilities =====

/**
 * Checks if the array is sorted in ascending order
 */
void showArray(int *a, int size);

/**
 * Swaps the contents of two array indexes
 */
bool isSorted(int a[], int lo, int hi);

/**
 * Prints the array's elements. If there are more than 100 elements, then only print
 * the first 50 and last 50 elements.
 */
void swap(int *a, int i, int j);

#endif
