#include <stdio.h>
#include <stdlib.h>
#include <assert.h>
#include <stdbool.h>
#include "heap.h"
#include "queue/queue.h"

#define EMPTY -1

/**
 * Create a new heap with the specified number of slots
 */
Heap newHeap(int size) {
    Heap heap = malloc(sizeof(struct HeapRep));
    // We malloc (size + 1) array slots since we index into the items array 
    // from indices 1 to numItems, not 0 to numItems-1
    Item *items = malloc(sizeof(Item) * (size + 1));
    for (int i = 0; i <= size; i++) items[i] = EMPTY;
    heap -> items = items;
    heap -> numItems = 0;
    heap -> numSlots = size;
    return heap;
}

/**
 * Given a heap, inserts a new item into that heap into the correct
 * position.
 */
void insert(Heap heap, Item newItem) {
    if (heap -> numItems >= heap -> numSlots) {
        printf("The heap is full!");
    }
    heap -> numItems++;
    int nextPosition = heap -> numItems;
    heap -> items[nextPosition] = newItem;
    bubbleUp(heap -> items, heap -> numItems);
}

/**
 * Given a heap, returns the root and reorganises the heap to preserve
 * its top-down ordering
 */
Item pop(Heap heap) {
    assert(heap -> numItems > 0);
    // Index 1 always contains the root element (highest priority element)
    Item root = heap -> items[1];
    Item lastElement = heap -> items[heap -> numItems];
    // Replacing the root with the right-most node at the last level of the heap tree
    heap -> items[1] = lastElement;
    // Bubble the new root down to the correct position to restore the top-down ordering of the heap
    bubbleDown(heap -> items, 1, heap -> numItems);
    heap -> numItems--;
    return root;
}

/**
 * Prints the heap in level-order
 */
void printHeap(Heap heap) {
    for (int i = 1; i <= heap -> numSlots; i++) {
        if (heap -> items[i] != EMPTY) {
            printf("%3d. %-3d ", i, heap -> items[i]);
            if (i * 2 + 1 <= heap -> numSlots && heap -> items[i * 2] != EMPTY && heap -> items[i * 2 + 1] != EMPTY) {
                printf("(left: %d, right: %d)\n", heap -> items[i * 2], heap -> items[i * 2 + 1]);
            } else if (i * 2 <= heap -> numSlots && heap -> items[i * 2] != EMPTY) {
                printf("(left: %d)\n", heap -> items[i * 2]);
            } else if (i * 2 + 1 <= heap -> numSlots && heap -> items[i * 2 + 1] != EMPTY) {
                printf("(right: %d)\n", heap -> items[i * 2 + 1]);
            } else {
                printf("\n");
            }
        } else {
            printf("%3d. __\n", i);
        }
    }
}

/**
 * Returns true/false depending on whether the heap is empty or not
 */
bool heapIsEmpty(Heap heap) {
    return (heap -> numItems <= 0);
}

/**
 * Frees the memory associated with the heap
 */
void dropHeap(Heap heap) {
    free(heap -> items);
    free(heap);
}

// Bubble up and bubble down helper functions. These for restoring the
// heap to correct order after insertion and deletion respectively

/**
 * Given an array of items and a target index, moves the target index up
 * into the correct position in the array
 */
void bubbleUp(Item *items, int i) {
    while (i > 1 && items[i / 2] < items[i]) {
        // Bubble the current node to take the place of their parent
        swapPositions(items, i, i / 2);
        i = i / 2;
    }
}

/**
 * Given an array of items and a target index, moves the target index down
 * into the correct position in the array
 */
void bubbleDown(Item *a, int i, int N) {
    while (i * 2 <= N) {
        int j = 2 * i;
        // Choose either the left or right child, depending on who has the larger value
        if (j < N && a[j] < a[j + 1]) j++;
        if (!(a[i] < a[j])) break;
        // Swap positions to proceed one level down the heap tree
        swapPositions(a, i, j);
        i = j;
    }
}

// ===== Static Helper Functions =====
/**
 * Given an array of items, swaps the position of the element at index
 * a and the element at index b.
 */
static void swapPositions(Item *items, int a, int b) {
    Item tmp = items[a];
    items[a] = items[b];
    items[b] = tmp;
}
