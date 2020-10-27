#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <assert.h>
#include "Stack.h"
#include "Item.h"

#define MAXITEMS 500 

typedef struct StackRep {
	char item[MAXITEMS];
	int  top;
} StackRep;

Stack newStack() {
	Stack s;
	s = malloc(sizeof(StackRep));
	assert(s != NULL);
	s -> top = -1;
	return s;
}

void dropStack(Stack s) {
	assert(s != NULL);
	free(s);
}

void stackPush(Stack s, Item it) {
	assert(s -> top < MAXITEMS-1);
	s -> top++;
	int i = s -> top;
	s -> item[i] = it;
}

Item stackPop(Stack s) {
	assert(s -> top > -1);
	int i = s -> top;
	Item it = s -> item[i];
	s -> top--;
	return it;
}

bool stackIsEmpty(Stack s) {
	return (s -> top < 0);
}

static void reverseRecursive(Stack s, int leftTip, int rightTip) {
	if (leftTip >= rightTip) return;
	Item tmp = s -> item[leftTip];
	s -> item[leftTip] = s -> item[rightTip];
	s -> item[rightTip] = tmp;
	reverseRecursive(s, leftTip + 1, rightTip - 1);
}

void stackReverse(Stack s) {
	if (stackIsEmpty(s)) return;
	reverseRecursive(s, 0, s -> top);
}

void showStack(Stack s) {
	for (int i = 0; i <= s->top; i++) {
		ItemShow(s -> item[i]);
		printf(" ← ");
	}
	printf("Top\n");
}

void printPath(Stack s) {
	stackReverse(s);
    printf("Path: %d", stackPop(s));
	while (!stackIsEmpty(s)) {
		printf(" → %d", stackPop(s));
	}
	printf("\n");
}
