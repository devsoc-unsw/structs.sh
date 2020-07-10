#ifndef QUEUE
#define QUEUE

typedef struct Queue* Queue;

Queue createQueue(unsigned capacity);
int isFull(Queue queue);
int isEmpty(Queue queue);
void enqueue(Queue queue, int item);
int dequeue(Queue queue);
int head(Queue queue);
int tail(Queue queue);

#endif