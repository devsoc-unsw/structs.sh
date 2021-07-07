#include <assert.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct node *Node;
struct node {
	int value;    // 4 bytes
	Node next;    // 8 bytes
};

Node createNode(int value) {
	Node n = malloc(sizeof(struct node));   // 8 bytes
	assert(n != NULL);
	
	n->value = value;
	n->next = NULL;
	return n;
}

int main(void) {
	Node n1 = createNode(3);
	n1->next = createNode(1);
	n1->next->next = createNode(4);
	
	printf("%d -> %d -> %d\n", n1->value, n1->next->value, n1->next->next->value);
	free(n1 -> next -> next);
	free(n1 -> next);
	free(n1);
}
