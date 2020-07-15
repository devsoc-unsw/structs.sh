#ifndef SORT_ALGOS
#define SORT_ALGOS

#include <stdbool.h>

void selectionSort(int *a, int lo, int hi);

void insertionSort(int *a, int lo, int hi);

void bubbleSort(int *a, int lo, int hi);

void shellSort(int *a, int lo, int hi);

void quicksort(int *a, int lo, int hi);
static int partition(int *a, int lo, int hi); 

void mergesort(int *a, int lo, int hi);

void heapsort(int *a, int lo, int hi);

void showArray(int *a, int size);
bool isSorted(int a[], int lo, int hi);
void swap(int *a, int i, int j);

#endif
