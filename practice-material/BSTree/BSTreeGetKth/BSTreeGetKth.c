
#include <stdlib.h>

#include "BSTree.h"

int count(BSTree t) {
	return (t == NULL) ? (0) : (count(t->left) + count(t->right) + 1);
} 

int BSTreeGetKth(BSTree t, int k) {
	if (t == NULL) return -1;
	int numOnLeft = count(t -> left);
	if (numOnLeft == k) return t -> value;
	else if (numOnLeft > k) return BSTreeGetKth(t -> left, k);
	else return BSTreeGetKth(t -> right, k - numOnLeft - 1);
}

