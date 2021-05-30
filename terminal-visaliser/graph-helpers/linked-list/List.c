#include <stdlib.h>
#include <stdio.h>
#include <assert.h>
#include "List.h"
#include "Item.h"

typedef struct ListNode {
	Item value;
	struct ListNode *next;
} ListNode;

typedef struct ListRep {
	ListNode *first; 
	ListNode *last;   
} ListRep;

List newList() {
	List L;
	L = malloc(sizeof(ListRep));
	assert(L != NULL);
	L->first = NULL;
	L->last = NULL;
	return L;
}

void dropList(List L) {
	assert(L != NULL);
	ListNode *next;
	while (L->first != NULL) {
		next = L->first->next;
		ItemDrop(L->first->value);
		free(L->first);
		L->first = next;
	}
	free(L);
}

// display as [1,2,3,4...]
void showList(List L) {
	assert(L != NULL);
	ListNode *curr = L->first;
	printf("[");
	while (curr != NULL) {
		ItemShow(curr->value);
		if (curr->next != NULL)
			printf(",");
		curr = curr->next;
	}
	printf("]");
}

// add item into list
// no check for duplicates
void ListInsert(List L, Item it) {
	assert(L != NULL);
	ListNode *prev, *curr;
	prev = NULL; curr = L->first;
	while (curr != NULL) {
		if (ItemEQ(ItemKey(it),ItemKey(curr->value)))
			return; // already in list
		if (ItemGT(ItemKey(curr->value),ItemKey(it)))
            break;
		prev = curr;
		curr = curr->next;
	}
	ListNode *new = malloc(sizeof(ListNode));
	assert(new != NULL);
	new->value = ItemCopy(it);
	new->next = NULL;
	if (L->last == NULL)
		L->first = L->last = new;
	else {
        if (prev == NULL) {      // insert at front
            new->next = L->first;
            L->first = new;
        }
        else if (curr == NULL) { // insert at end
			L->last->next = new;
			L->last = new;
		}
		else {                  // insert in middle
			new->next = prev->next;
			prev->next = new;
		}
	}
}

// remove item(s)
// assumes no duplicates
void ListDelete(List L, Key k) {
	assert(L != NULL);
	ListNode *prev, *curr;
	prev = NULL; curr = L->first;
	while (curr != NULL) {
		if (ItemEQ(k,ItemKey(curr->value)))
			break;
		prev = curr;
		curr = curr->next;
	}
	if (curr != NULL) {
		if (prev == NULL)
			L->first = curr->next;
		else
			prev->next = curr->next;
		
		if (curr == L->last)
			L->last = prev;
		
		free(curr);
		if (L->first == NULL)
			L->last = NULL;
	}
}

Item *ListSearch(List L, Key k) {
	assert(L != NULL);
	ListNode *curr = L->first;
	while (curr != NULL) {
		if (ItemEQ(k,ItemKey(curr->value)))
			return &(curr->value);
		else
			curr = curr->next;
	}
	return NULL; // key not found
}

int ListLength(List L) {
	int n = 0;
	ListNode *curr = L->first; 
	while (curr != NULL) {
		n++;
		curr = curr->next;
	}
	return n;
}
