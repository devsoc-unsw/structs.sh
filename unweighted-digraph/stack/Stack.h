#ifndef STACK_H
#define STACK_H

#include "Item.h"

typedef struct StackRep *Stack;

// set up empty stack
Stack newStack();

// remove unwanted stack
void dropStack(Stack);

// insert a char on top of stack
void stackPush(Stack,Item);

// remove char from top of stack
Item stackPop(Stack);

// check whether stack is empty
int stackIsEmpty(Stack);

// display contents of stack
void showStack(Stack);

#endif
