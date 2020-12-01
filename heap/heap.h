#ifndef HEAP_H
#define HEAP_H

#include <stdbool.h>
#include <limits.h>

#define EMPTY -INT_MAX
#define MAX_HEAP 1
#define MIN_HEAP 2

typedef int Item;

// Struct definition for heaps
struct HeapRep {
    Item *items;
    int numItems;
    int numSlots;
};
typedef struct HeapRep *Heap;

/**
 * Create a new heap with the specified number of slots
 */
Heap newHeap(int size);

/**
 * INSERT: insert <d>
 * Given a heap, inserts a new item into that heap into the correct
 * position.
 */
void insertHeap(Heap heap, Item newItem, int heapType);

/**
 * POP: pop
 * Given a heap, returns the root and reorganises the heap to preserve
 * its top-down ordering
 */
Item popHeap(Heap heap, int heapType);

/**
 * SHOW: show
 * Prints the heap in level-order
 */
void printHeap(Heap heap);

/**
 * CLEAR: clear
 * Frees the memory associated with the heap
 */
void dropHeap(Heap heap);

// Note: the 'popall' command has no implementation. It's just a repeated call to popHeap


// ===== Other Helper Functions =====

/**
 * Returns true/false depending on whether the heap is empty or not
 */
bool heapIsEmpty(Heap heap);

// Bubble up and bubble down helper functions. These for restoring the
// heap to correct order after insertion and deletion respectively

/**
 * Given an array of items and a target index, moves the target index up
 * into the correct position in the array
 */
void bubbleUp(Item *items, int currIndex, int heapType);

/**
 * Given an array of items and a target index, moves the target index down
 * into the correct position in the array
 */
void bubbleDown(Item *a, int N, int heapType);

/**
 * Given an array of items, swaps the position of the element at index
 * a and the element at index b.
 */
static void swapPositions(Item *items, int a, int b);

#endif
