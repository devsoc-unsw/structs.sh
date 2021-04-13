#ifndef LIST_H
#define LIST_H

#include <stdlib.h>
#include "Item.h"

typedef struct ListRep *List;

/**
 * Instantiates a new linked list of items
 */
List newList(); 

/**
 * Deallocates memory associated with the given list
 */
void dropList(List list); 

/**
 * Prints the contents of the list
 */
void showList(List list);

/**
 * Inserts an item at the end of the list
 */
void ListInsert(List list, Item item); 

/**
 * Deletes the specified item
 */
void ListDelete(List list, Key key); 

/**
 * Returns the target item, if found 
 */
Item *ListSearch(List list, Key key); 

/**
 * Returns the number of items in the list
 */
int ListLength(List list); 

#endif
