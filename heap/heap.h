#ifndef HEAP
#define HEAP

typedef int Item;

struct HeapRep {
    Item *items;
    int numItems;
    int numSlots;
};

typedef struct HeapRep *Heap;

#endif
