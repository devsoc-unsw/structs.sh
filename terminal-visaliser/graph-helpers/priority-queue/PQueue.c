#include <stdlib.h>
#include <stdio.h>
#include <stdbool.h>
#include <assert.h>
#include "Item.h"
#include "PQueue.h"

typedef struct PQueueNode {
	Item value;
	int  weight;
	struct PQueueNode *next;
} PQueueNode;

typedef struct PQueueRep {
	PQueueNode *head;  
} PQueueRep;


PQueue newPQueue() {
	PQueue q;
	q = malloc(sizeof(PQueueRep));
	assert(q != NULL);
	q->head = NULL;
	return q;
}

void dropPQueue(PQueue Q) {
	PQueueNode *curr, *next;
	assert(Q != NULL);
	curr = Q->head;
	while (curr != NULL) {
		next = curr->next;
		free(curr);
		curr = next;
	}
	free(Q);
}

void showPQueue(PQueue Q) {
	PQueueNode *curr;
	assert(Q != NULL);
	curr = Q->head;
	while (curr != NULL) {
		printf("%d:",curr->weight);
		ItemShow(curr->value);
		if (curr->next != NULL)
			printf(">");
		curr = curr->next;
	}
	printf("\n");
}

void PQueueJoin(PQueue Q, Item it, int weight) {
	assert(Q != NULL);
	PQueueNode *new = malloc(sizeof(PQueueNode));
	assert(new != NULL);
	new->value = ItemCopy(it);
	new->weight = weight;
	new->next = NULL;
	PQueueNode *curr, *prev;
	curr = Q->head; prev = NULL;
	while (curr != NULL) {
		if (weight > curr->weight) break;
		prev = curr;
		curr = curr->next;
	}
	if (prev == NULL) {
		new->next = Q->head;
		Q->head = new;
	}
	else {
		new->next = prev->next;
		prev->next = new;
	}
}

Item PQueueLeave(PQueue Q) {
	assert(Q != NULL);
	assert(Q->head != NULL);
	Item it = ItemCopy(Q->head->value);
	PQueueNode *old = Q->head;
	Q->head = old->next;
	free(old);
	return it;
}

bool PQueueIsEmpty(PQueue Q) {
	return (Q->head == NULL);
}

