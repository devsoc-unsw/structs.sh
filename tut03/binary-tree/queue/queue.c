#include <limits.h> 
#include <stdio.h> 
#include <stdlib.h>
#include "queue.h" 
  
// A structure to represent a queue 
struct Queue { 
    int head, tail, size; 
    unsigned capacity; 
    int *array; 
};
  
// function to create a queue 
// of given capacity. 
// It initializes size of queue as 0 
struct Queue *createQueue(unsigned capacity) { 
    struct Queue *queue = (struct Queue*)malloc( 
        sizeof(struct Queue)); 
    queue -> capacity = capacity; 
    queue -> head = queue -> size = 0; 
  
    // This is important, see the enqueue 
    queue -> tail = capacity - 1; 
    queue -> array = (int*)malloc( 
        queue -> capacity  *sizeof(int)); 
    return queue; 
} 
  
// Queue is full when size becomes 
// equal to the capacity 
int isFull(struct Queue *queue) { 
    return (queue -> size == queue -> capacity); 
} 
  
// Queue is empty when size is 0 
int isEmpty(struct Queue *queue) { 
    return (queue -> size == 0); 
} 
  
// Function to add an item to the queue. 
// It changes tail and size 
void enqueue(struct Queue *queue, int item) { 
    if (isFull(queue)) 
        return; 
    queue -> tail = (queue -> tail + 1) 
                  % queue -> capacity; 
    queue -> array[queue -> tail] = item; 
    queue -> size = queue -> size + 1; 
    printf("%d enqueued to queue\n", item); 
} 
  
// Function to remove an item from queue. 
// It changes head and size 
int dequeue(struct Queue *queue) { 
    if (isEmpty(queue)) 
        return INT_MIN; 
    int item = queue -> array[queue -> head]; 
    queue -> head = (queue -> head + 1) 
                   % queue -> capacity; 
    queue -> size = queue -> size - 1; 
    return item; 
} 
  
// Function to get head of queue 
int head(struct Queue *queue) { 
    if (isEmpty(queue)) 
        return INT_MIN; 
    return queue -> array[queue -> head]; 
} 
  
// Function to get tail of queue 
int tail(struct Queue *queue) { 
    if (isEmpty(queue)) 
        return INT_MIN; 
    return queue -> array[queue -> tail]; 
} 
