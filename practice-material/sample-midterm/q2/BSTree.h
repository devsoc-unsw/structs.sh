// Binary Search BSTree ADT interface 

#include <stdbool.h>

/* External view of BSTree (key is of type int)
   The file BSTree.c is NOT provided for this exam.

   To simplify this exam setup, we are exposing the 
   following types to a client.
*/

#define key(tree)  ((tree)->key)
#define left(tree)  ((tree)->left)
#define right(tree) ((tree)->right)

typedef int Key;      

typedef struct Node *BSTree;
typedef struct Node {
   int  key;
   BSTree left, right;
} Node;

//typedef struct Node *BSTree;


BSTree newBSTree();        // create an empty BSTree
void freeBSTree(BSTree);   // free memory associated with BSTree
void showBSTree(BSTree);   // display a BSTree (sideways)

bool BSTreeSearch(BSTree, Key);   // check whether a key is in a BSTree
int  BSTreeHeight(BSTree);         // compute height of BSTree
int  BSTreeNumNodes(BSTree);       // count #nodes in BSTree
BSTree BSTreeInsert(BSTree, Key);   // insert a new key into a BSTree
BSTree BSTreeDelete(BSTree, Key);   // delete a key from a BSTree

// internal functions made visible for testing
BSTree rotateRight(BSTree);
BSTree rotateLeft(BSTree);
BSTree insertAtRoot(BSTree, Key);
BSTree partition(BSTree, int);
BSTree rebalance(BSTree);
