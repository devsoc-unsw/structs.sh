// Stack.c

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "Stack.h"

struct node {
	int          item;
	struct node *next;
};

struct stack {
	struct node *top;
	int          size;
};

static struct node *createNode(int item);

Stack StackNew(void) {
	Stack new = malloc(sizeof(struct stack));
	if (new == NULL) {
		fprintf(stderr, "StackNew: Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}

	new->top = NULL;
	new->size = 0;
	return new;
}

void StackDrop(Stack s) {
	assert(s != NULL);

	struct node *curr = s->top;
	while (curr != NULL) {
		struct node *temp = curr;
		curr = curr->next;
		free(temp);
	}
	free(s);
}

void StackPush(Stack s, int item) {
	assert(s != NULL);

	struct node *new = createNode(item);
	new->next = s->top;
	s->top = new;
	s->size++;
}

static struct node *createNode(int item) {
	struct node *new = malloc(sizeof(struct node));
	if (new == NULL) {
		fprintf(stderr, "StackPush: Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}

	new->item = item;
	new->next = NULL;
	return new;
}

int StackPop(Stack s) {
	assert(s != NULL);

	if (StackIsEmpty(s)) {
		fprintf(stderr, "StackPop: Stack is empty!\n");
		exit(EXIT_FAILURE);
	}

	struct node *temp = s->top;
	int item = temp->item;
	s->top = temp->next;
	s->size--;
	free(temp);
	return item;
}

int StackPeek(Stack s) {
	assert(s != NULL);
	
	if (StackIsEmpty(s)) {
		fprintf(stderr, "StackPeek: Stack is empty!\n");
		exit(EXIT_FAILURE);
	}
	
	return s->top->item;
}

int StackSize(Stack s) {
	assert(s != NULL);
	
	return s->size;
}

bool StackIsEmpty(Stack s) {
	assert(s != NULL);

	return (s->size == 0);
}

void StackDump(Stack s, FILE *fp) {
	assert(s != NULL);

	struct node *curr = s->top;
	while (curr != NULL) {
		if (curr != s->top) {
			fprintf(fp, " ");
		}
		printf("%d ", curr->item);
		curr = curr->next;
	}
	fprintf(fp, "\n");
}


