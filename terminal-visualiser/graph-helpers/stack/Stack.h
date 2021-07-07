#ifndef STACK_H
#define STACK_H

#include "Item.h"

typedef struct StackRep *Stack;

/**
 * Initialise a new stack
 */
Stack newStack();

/**
 * Deallocates memory associated with the stack
 */
void dropStack(Stack s);

/**
 * Inserts an item to the top of the stack
 */
void stackPush(Stack s, Item item);

/**
 * Takes off the item at the top of the stack
 */
Item stackPop(Stack s);

/**
 * Checks whether the stack is empty or not
 */
bool stackIsEmpty(Stack);

/**
 * Shows the items on the stack, first in last out
 */
void showStack(Stack);

/**
 * Prints the path traced by the items in the stack, reverse of showStack
 */
void printPath(Stack s);

#endif
