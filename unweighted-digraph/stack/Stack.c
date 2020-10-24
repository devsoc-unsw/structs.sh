#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include "Stack.h"
#include "Item.h"

#define MAXITEMS 500

typedef struct StackRep {
	char item[MAXITEMS];
	int  top;
} StackRep;

// set up empty stack
Stack newStack() {
	Stack s;
	s = malloc(sizeof(StackRep));
	assert(s != NULL);
	s->top = -1;
	return s;
}

// remove unwanted stack
void dropStack(Stack s) {
	assert(s != NULL);
	free(s);
}

// insert char on top of stack
void stackPush(Stack s, Item it) {
	assert(s->top < MAXITEMS-1);
	s->top++;
	int i = s->top;
	s->item[i] = it;
}

// remove char from top of stack
Item stackPop(Stack s) {
	assert(s->top > -1);
	int i = s->top;
	Item it = s->item[i];
	s->top--;
	return it;
}

// check whether stack is empty
int stackIsEmpty(Stack s) {
	return (s->top < 0);
}

// display contents of stack
void showStack(Stack s) {
	int i;
	for (i = 0; i <= s->top; i++) {
		ItemShow(s->item[i]);
		printf(" ← ");
	}
	printf("Top\n");
}
