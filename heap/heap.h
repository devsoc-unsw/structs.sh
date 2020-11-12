#ifndef HEAP
#define HEAP

#include <stdbool.h>
#include <limits.h>

#define EMPTY -INT_MAX

typedef int Item;

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
 * Given a heap, inserts a new item into that heap into the correct
 * position.
 */
void insertHeap(Heap heap, Item newItem);

/**
 * Given a heap, returns the root and reorganises the heap to preserve
 * its top-down ordering
 */
Item popHeap(Heap heap);

/**
 * Prints the heap in level-order
 */
void printHeap(Heap heap);

/**
 * Returns true/false depending on whether the heap is empty or not
 */
bool heapIsEmpty(Heap heap);

/**
 * Frees the memory associated with the heap
 */
void dropHeap(Heap heap);


// Bubble up and bubble down helper functions. These for restoring the
// heap to correct order after insertion and deletion respectively

/**
 * Given an array of items and a target index, moves the target index up
 * into the correct position in the array
 */
void bubbleUp(Item *items, int currIndex);

/**
 * Given an array of items and a target index, moves the target index down
 * into the correct position in the array
 */
void bubbleDown(Item *a, int i, int N);

// ===== Static Helper Functions =====
/**
 * Given an array of items, swaps the position of the element at index
 * a and the element at index b.
 */
static void swapPositions(Item *items, int a, int b);

#endif
