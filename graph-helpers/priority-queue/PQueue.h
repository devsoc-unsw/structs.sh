#ifndef QUEUE_H
#define QUEUE_H

#include <stdbool.h>
#include "Item.h"

typedef struct PQueueRep *PQueue;

/**
 * Instantiates a new priority queue of items
 */
PQueue newPQueue();

/**
 * Deallocates memory associated with the given priority queue
 */
void dropPQueue(PQueue);

/**
 * Prints the contents of the priority queue
 */
void showPQueue(PQueue);

/**
 * Inserts an item at the end of the priority queue
 */
void PQueueJoin(PQueue,Item,int);

/**
 * Deletes the specified item
 */
Item PQueueLeave(PQueue);

/**
 * Checks whether the priority queue is empty or not
 */
bool PQueueIsEmpty(PQueue);

#endif
