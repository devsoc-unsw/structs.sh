#ifndef LIST_H
#define LIST_H

#include <stdlib.h>
#include "Item.h"

typedef struct ListRep *List;

List newList(); // create new empty list
void dropList(List); // free memory used by list
void showList(List); // display as [1,2,3...]
void ListInsert(List,Item); // add item into list
void ListDelete(List,Key); // remove item
Item *ListSearch(List,Key); // return item with key
int  ListLength(List); // # items in list

#endif
