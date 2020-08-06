// Interface for a stack of integers

#ifndef STACK_H
#define STACK_H

#include <stdlib.h>

typedef struct stack *Stack;

// Create a new stack
Stack StackNew(void);

// Free all resources allocated for the stack
void StackDrop(Stack s);

// Push an item onto the stack
void StackPush(Stack s, int item);

// Pop an item off the stack and return it
int StackPop(Stack s);

// Get the item at the top of the stack (without removing it)
int StackPeek(Stack s);

// Get the number of elements in the stack
int StackSize(Stack s);

// Check if the stack is empty
bool StackIsEmpty(Stack s);

// Print the stack to an open file (for debugging) as a line of space-
// separated items, with the item at the top of the stack first
void StackDump(Stack s, FILE *fp);

#endif


