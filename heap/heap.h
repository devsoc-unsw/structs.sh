#ifndef HEAP
#define HEAP

typedef int Item;

struct HeapRep {
    Item *items;
    int numItems;
    int numSlots;
};

typedef struct HeapRep *Heap;

Heap newHeap(int size);
void insert(Heap heap, Item newItem);
Item pop(Heap heap);
void printHeap(Heap heap);
void bubbleUp(Item *items, int currIndex);
void bubbleDown(Item *a, int i, int N);

static void swapPositions(Item *items, int a, int b);

#endif
