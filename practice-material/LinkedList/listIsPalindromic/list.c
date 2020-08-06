// A doubly linked list of integers

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "list.h"

static List strToList(char *s);
static char *myStrdup(char *s);
static Node newNode(int value);

List newList(void) {
	List l = malloc(sizeof(*l));
	if (l == NULL) {
		fprintf(stderr, "couldn't allocate list\n");
		exit(EXIT_FAILURE);
	}
	l->first = NULL;
	l->last = NULL;
	l->size = 0;
	return l;
}

List readList(void) {
	char buf[MAX_LINE_LEN + 2] = {0};
	fgets(buf, MAX_LINE_LEN + 2, stdin);
	return strToList(buf);
}

static List strToList(char *s) {
	char *copy = myStrdup(s);
	List l = newList();
	char *token = strtok(copy, " \n\t");
	while (token != NULL) {
		Node n = newNode(atoi(token));
		if (l->first == NULL) {
			l->first = n;
		} else {
			l->last->next = n;
			n->prev = l->last;
		}
		l->last = n;
		l->size++;
		token = strtok(NULL, " \n\t");
	}
	free(copy);
	return l;
}

static char *myStrdup(char *s) {
	char *copy = malloc((strlen(s) + 1) * sizeof(char));
	strcpy(copy, s);
	return copy;
}

static Node newNode(int value) {
	Node n = malloc(sizeof(*n));
	if (n == NULL) {
		fprintf(stderr, "couldn't allocate node\n");
		exit(EXIT_FAILURE);
	}
	n->value = value;
	n->next = NULL;
	n->prev = NULL;
	return n;
}

void freeList(List l) {
	Node curr = l->first;
	while (curr != NULL) {
		Node temp = curr;
		curr = curr->next;
		free(temp);
	}
	free(l);
}

void printList(List l) {
	Node curr;
	printf("Size: %d\n", l->size);
	
	printf("Forwards:  ");
	curr = l->first;
	while (curr != NULL) {
		printf("[%d] -> ", curr->value);
		curr = curr->next;
	}
	printf("X\n");

	printf("Backwards: ");
	curr = l->last;
	while (curr != NULL) {
		printf("[%d] -> ", curr->value);
		curr = curr->prev;
	}
	printf("X\n");
}

////////////////////////////////////////////////////////////////////////
// listIsValid

static int forwardLength(List l);
static int backwardLength(List l);
static Node *forwardNodeAddrs(List l, int *len);
static Node *backwardNodeAddrs(List l, int *len);

/**
 * Checks that the given list is a valid doubly linked list.
 * A doubly linked list is valid if it meets these requirements:
 * 1) The number of nodes in the forwards direction (i.e., starting from
 *    l->first  and  following the next pointers) is equal to the number
 *    of  nodes  in the backwards direction (i.e., starting from l->last
 *    and following the prev pointers).
 * 2) The number of nodes is equal to the list's size field.
 * 3) The  sequence  of  addresses of nodes in the forwards direction is
 *    equal  to the reverse of the sequence of addresses of nodes in the
 *    backwards direction.
 */
void checkValidity(List l) {
	int forwardLength = 0, backwardLength = 0;
	Node *forwardAddrs = forwardNodeAddrs(l, &forwardLength);
	Node *backwardAddrs = backwardNodeAddrs(l, &backwardLength);
	
	// Check 1)
	if (forwardLength != backwardLength) {
		printf("Error: forward length =/= backward length\n");
	// Check 2)
	} else if (forwardLength != l->size) {
		printf("Error: length =/= size field\n");
	// Check 3)
	} else {
		for (int i = 0; i < forwardLength; i++) {
			if (forwardAddrs[i] != backwardAddrs[forwardLength - i - 1]) {
				printf("Error: forward node addresses =/= backward node "
					   "addresses\n");
				break;
			}
		}
	}
	
	free(forwardAddrs);
	free(backwardAddrs);
}

static int forwardLength(List l) {
	int length = 0;
	for (Node curr = l->first; curr != NULL; curr = curr->next) {
		length++;
	}
	return length;
}

static int backwardLength(List l) {
	int length = 0;
	for (Node curr = l->last; curr != NULL; curr = curr->prev) {
		length++;
	}
	return length;
}

static Node *forwardNodeAddrs(List l, int *len) {
	*len = forwardLength(l);
	Node *addrs = malloc((*len + 1) * sizeof(Node));
	int i = 0;
	for (Node curr = l->first; curr != NULL; curr = curr->next) {
		addrs[i++] = curr;
	}
	addrs[i] = NULL;
	return addrs;
}

static Node *backwardNodeAddrs(List l, int *len) {
	*len = backwardLength(l);
	Node *addrs = malloc((*len + 1) * sizeof(Node));
	int i = 0;
	for (Node curr = l->last; curr != NULL; curr = curr->prev) {
		addrs[i++] = curr;
	}
	addrs[i] = NULL;
	return addrs;
}

////////////////////////////////////////////////////////////////////////
// The functions below are used to check that certain rules are followed

static int listLength(List l);

NodeData *getListNodeData(List l) {
	int len = listLength(l);
	NodeData *addrs = malloc((len + 1) * sizeof(NodeData));
	int i = 0;
	for (Node curr = l->first; curr != NULL; curr = curr->next) {
		addrs[i].addr = curr;
		addrs[i].value = curr->value;
		i++;
	}
	addrs[i].addr = NULL;
	return addrs;
}

bool noNewNodes(NodeData *before, NodeData *after) {
	for (int i = 0; after[i].addr != NULL; i++) {
		bool isNew = true;
		for (int j = 0; before[j].addr != NULL; j++) {
			if (after[i].addr == before[j].addr) {
				isNew = false;
				break;
			}
		}
		if (isNew) return false;
	}
	return true;
}

bool noChangedValues(NodeData *before, NodeData *after) {
	for (int i = 0; after[i].addr != NULL; i++) {
		for (int j = 0; before[j].addr != NULL; j++) {
			if (after[i].addr == before[j].addr) {
				if (after[i].value != before[j].value) {
					return false;
				}
				break;
			}
		}
	}
	return true;
}

bool notModified(NodeData *before, NodeData *after) {
	int i = 0;
	while (after[i].addr != NULL && before[i].addr != NULL) {
		if (after[i].addr != before[i].addr ||
				after[i].value != before[i].value) {
			return false;
		}
		i++;
	}
	return (before[i].addr == NULL && after[i].addr == NULL);
}

static int listLength(List l) {
	int length = 0;
	for (Node curr = l->first; curr != NULL; curr = curr->next) {
		length++;
	}
	return length;
}

