// Queue.c

#include <assert.h>
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>

#include "Queue.h"

struct node {
	int          item;
	struct node *next;
};

struct queue {
	struct node *front;
	struct node *back;
	int          size;
};

static struct node *createNode(int item);

// Create a new queue
Queue QueueNew(void) {
	Queue new = malloc(sizeof(*new));
	if (new == NULL) {
		fprintf(stderr, "QueueNew: Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}
	
	new->front = NULL;
	new->back = NULL;
	new->size = 0;
	return new;
}

// Free all resources allocated for the queue
void QueueFree(Queue q) {
	assert(q != NULL);
	
	struct node *curr = q->front;
	while (curr != NULL) {
		struct node *temp = curr;
		curr = curr->next;
		free(temp);
	}
	free(q);
}

// Add an item to the end of the queue
void QueueEnqueue(Queue q, int item) {
	struct node *new = createNode(item);
	if (q->size == 0) {
		q->front = new;
	} else {
		q->back->next = new;
	}
	q->back = new;
	q->size++;
}

static struct node *createNode(int item) {
	struct node *new = malloc(sizeof(*new));
	if (new == NULL) {
		fprintf(stderr, "QueueEnqueue: Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}
	new->item = item;
	new->next = NULL;
	return new;
}

// Remove an item from the front of the queue and return it
int QueueDequeue(Queue q) {
	assert(q != NULL);
	assert(QueueSize(q) > 0);
	
	int item = q->front->item;
	struct node *newFront = q->front->next;
	free(q->front);
	q->front = newFront;
	q->size--;
	
	if (q->size == 0) {
		q->back = NULL;
	}
	return item;
}

// Get the item at the front of the queue (without removing it)
int QueuePeek(Queue q) {
	assert(q != NULL);
	assert(QueueSize(q) > 0);
	
	return q->front->item;
}

// Get the number of items in the queue
int QueueSize(Queue q) {
	assert(q != NULL);
	
	return q->size;
}

// Check if the queue is empty
bool QueueIsEmpty(Queue q) {
	assert(q != NULL);
	
	return (QueueSize(q) == 0);
}

// Print the queue to an open file (for debugging)
void QueueDump(Queue q, FILE *fp) {
	assert(q != NULL);

	struct node *curr = q->front;
	while (curr != NULL) {
		if (curr != q->front) {
			fprintf(fp, " ");
		}
		fprintf(fp, "%d", curr->item);
		curr = curr->next;
	}
	fprintf(fp, "\n");
}


