#include <stdio.h>
#include <stdlib.h>
#include "heap.h"


/**
 * 
 */
Heap newHeap(int size) {
    Heap heap = malloc(sizeof(struct HeapRep));
    // We malloc (size + 1) array slots since we index into the items array 
    // from indices 1 to numItems, not 0 to numItems-1
    Item *items = malloc(sizeof(Item) * (size + 1));
    heap -> items = items;
    heap -> numItems = 0;
    heap -> numSlots = size;
    return heap;
}

/**
 * 
 */
void insert(Heap heap, Item newItem) {
    if (heap -> numItems >= heap -> numSlots) {
        printf("The heap is full!");
    }
    int nextPosition = heap -> numItems;
    heap -> items[nextPosition] = newItem;
    bubbleUp(heap -> items, heap -> numItems);
    heap -> numItems++;
}

/**
 * 
 */
Item pop(Heap heap, Item newItem) {
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

// Bubble up and bubble down helper functions. These for restoring the
// heap to correct order after insertion and deletion respectively

/**
 * 
 */
void bubbleUp(Item *items, int currIndex) {
    Item curr = items[currIndex];
    Item parent = items[currIndex / 2];
    while (currIndex > 1 && curr > parent) {
        // Bubble the current node to take the place of their parent
        swapPositions(items, curr, parent);
        currIndex = currIndex / 2;
        curr = items[currIndex];
        parent = items[currIndex / 2];
    }
}

/**
 * 
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
