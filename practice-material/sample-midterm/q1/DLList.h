// DLList.h - Interface to doubly-linked list ADT
// Written by John Shepherd on March 2013, modified on August 2014
// Modified by Ashesh Mahidadia on August 2017

#ifndef DLLIST_H
#define DLLIST_H

#include <stdio.h>
#include "DLList.h"

/* External view of DLList (item is of type int).
   The file DLList.c is NOT provided for this exam.

   To simplify this exam setup, we are exposing the 
   following types to a client.
*/



typedef struct DLListNode {
	int   value;  // value of this list item (int)
	struct DLListNode *prev;
	               // pointer previous node in list
	struct DLListNode *next;
	               // pointer to next node in list
} DLListNode;

typedef struct DLListNode *DLListNodeP;

typedef struct DLListRep {
	int  nitems;      // count of items in list
	DLListNode *first; // first node in list
	DLListNode *curr;  // current node in list
	DLListNode *last;  // last node in list
} DLListRep;

typedef struct DLListRep *DLList;


/* creates a new DLListNode, with a given val  */
DLListNode *newDLListNode(int val);

// create a new empty DLList
DLList newDLList();

// free up all space associated with list
void freeDLList(DLList);


// return number of elements in a list
int DLListLength(DLList);

// is the list empty?
int DLListIsEmpty(DLList);



// create an DLList by reading items from a file
// assume that the file is open for reading
DLList getDLList(FILE *);

// displays comma separated list to a file, 
// assumes that the file is open for writing
void putDLList(FILE *, DLList);

// checks sanity of a DLList (for testing)
int validDLList(DLList);



#endif
