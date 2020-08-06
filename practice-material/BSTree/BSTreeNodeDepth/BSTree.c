
#include <stdbool.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "BSTree.h"

////////////////////////////////////////////////////////////////////////

static void readBSTreePrompt(char *traversal, int treeNo);
static int readIntArray(int *arr, int maxInts);
static int strToIntArray(char *s, int *arr, int maxInts);
static char *myStrdup(char *s);

static void checkArray(int *arr, int size);
static bool containsDuplicates(int *arr, int size);

static BSTree reconstruct(int *preorder, int size);
static BSTree newBSTNode(int value);

static int *insertionSortCopy(int *array, int arraySize);
static void insertionSort(int *array, int arraySize);

////////////////////////////////////////////////////////////////////////
// Reads in a tree from stdin

BSTree readBSTree(int treeNo) {
	readBSTreePrompt("preorder", treeNo);
	int arr[MAX_BST_SIZE];
	int size = readIntArray(arr, MAX_BST_SIZE);
	checkArray(arr, size);
	return reconstruct(arr, size);
}

static void readBSTreePrompt(char *traversal, int treeNo) {
	printf("Enter the %s traversal of ", traversal);
	if (treeNo <= 0) {
		printf("the BST: ");
	} else {
		printf("BST %d: ", treeNo);
	}
}

static int readIntArray(int *arr, int maxInts) {
	char buf[MAX_LINE_LEN + 2] = {};
	fgets(buf, MAX_LINE_LEN + 2, stdin);
	return strToIntArray(buf, arr, maxInts);
}

static int strToIntArray(char *s, int *arr, int maxInts) {
	char *copy = myStrdup(s);
	int size = 0;
	char *token = strtok(copy, " \n\t");
	while (token != NULL && size < maxInts) {
		arr[size++] = atoi(token);
		token = strtok(NULL, " \n\t");
	}
	free(copy);
	return size;
}

static char *myStrdup(char *s) {
	char *copy = malloc((strlen(s) + 1) * sizeof(char));
	return strcpy(copy, s);
}

static void checkArray(int *arr, int size) {
	int *copy = insertionSortCopy(arr, size);
	
	if (containsDuplicates(copy, size)) {
	    fprintf(stderr, "Error: Duplicate values are not allowed\n");
	    exit(EXIT_FAILURE);
	}
	
	free(copy);
}

static bool containsDuplicates(int *arr, int size) {
	for (int i = 0; i < size - 1; i++) {
		if (arr[i] == arr[i + 1]) {
			return true;
		}
	}
	return false;
}

// Reconstructs a tree given its preorder traversal
static BSTree reconstruct(int *preorder, int size) {
	if (size <= 0) return NULL;
	
	BSTree t = newBSTNode(preorder[0]);
	
	int i = 1;
	while (i < size && preorder[i] < preorder[0]) i++;
	int j = i;
	while (j < size && preorder[j] > preorder[0]) j++;
	
	if (j != size) {
		fprintf(stderr, "Error: Invalid preorder "
		                "traversal for a BST\n");
		exit(EXIT_FAILURE);
	}
	
	t->left  = reconstruct(&preorder[1], i - 1);
	t->right = reconstruct(&preorder[i], j - i);
	return t;
}

static BSTree newBSTNode(int value) {
	BSTree t = malloc(sizeof(*t));
	if (t == NULL) {
		fprintf(stderr, "Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}
	t->value = value;
	t->left = NULL;
	t->right = NULL;
	return t;
}

////////////////////////////////////////////////////////////////////////
// Frees a tree

void freeBSTree(BSTree t) {
	if (t != NULL) {
		freeBSTree(t->left);
		freeBSTree(t->right);
		free(t);
	}
}

////////////////////////////////////////////////////////////////////////
// Printing a Tree
//
// The following section contains code to display a tree.
// This code is very complicated. You do not need to understand these
// functions.
//
// ASCII tree printer
// Courtesy: ponnada
// Via: http://www.openasthra.com/c-tidbits/printing-binary-trees-in-ascii/

#include <string.h>

static int max(int x, int y) {
	if (x > y) {
		return x;
	} else {
		return y;
	}
}

// Data structures
typedef struct asciinode_struct asciinode;
struct asciinode_struct
{
	asciinode *left, *right;
	// Length of the edge from this node to its children
	int edge_length;
	int height;
	int lablen;
	// -1 = I am left, 0 = I am root, 1 = I am right
	int parent_dir;
	// Max supported unit32 in dec, 10 digits max
	char label[11];
};

static void print_level(asciinode *node, int x, int level);
static void compute_edge_lengths(asciinode *node);
static asciinode *build_ascii_tree_recursive(BSTree t);
static asciinode *build_ascii_tree(BSTree t);
static void free_ascii_tree(asciinode *node);
static void compute_lprofile(asciinode *node, int x, int y);
static void compute_rprofile(asciinode *node, int x, int y);

#define MAX_HEIGHT 1000
static int lprofile[MAX_HEIGHT];
static int rprofile[MAX_HEIGHT];
#define INFINITY (1<<20)

#define MIN(X, Y) (((X) < (Y)) ? (X) : (Y))
#define MAX(X, Y) (((X) > (Y)) ? (X) : (Y))

static int gap = 3; // Gap between left and right nodes

// Used for printing the next node in the same level
// This is the x coordinate of the next char printed
static int print_next;

// Prints ascii tree for given Tree structure
void printBSTree(BSTree t)
{
	printf("\n");
	asciinode *proot;
	int xmin, i;
	if (t == NULL) {
		printf("X\n\n");
		return;
	}
	proot = build_ascii_tree(t);
	compute_edge_lengths(proot);
	for (i = 0; i < proot->height && i < MAX_HEIGHT; i++) {
		lprofile[i] = INFINITY;
	}
	
	compute_lprofile(proot, 0, 0);
	xmin = 0;
	for (i = 0; i < proot->height && i < MAX_HEIGHT; i++) {
		xmin = MIN(xmin, lprofile[i]);
	}
	
	for (i = 0; i < proot->height; i++) {
		print_next = 0;
		print_level(proot, -xmin, i);
		printf("\n");
	}
	
	if (proot->height >= MAX_HEIGHT) {
		printf("(Tree is taller than %d; may be drawn incorrectly.)\n",
		       MAX_HEIGHT);
	}
	
	free_ascii_tree(proot);
	printf("\n");
}

// This function prints the given level of the given tree, assuming
// that the node has the given x coordinate.
static void print_level(asciinode *node, int x, int level)
{
	int i, isleft;
	if (node == NULL) return;
	isleft = (node->parent_dir == -1);
	
	if (level == 0) {
		for (i = 0; i < (x - print_next - ((node->lablen - isleft)/2)); i++) {
			printf(" ");
		}
		print_next += i;
		printf("%s", node->label);
		print_next += node->lablen;
		
	} else if (node->edge_length >= level) {
		if (node->left != NULL) {
			for (i = 0; i < (x - print_next - (level)); i++) {
				printf(" ");
			}
			print_next += i;
			printf("/");
			print_next++;
		}
		
		if (node->right != NULL) {
			for (i = 0; i < (x - print_next + (level)); i++) {
				printf(" ");
			}
			print_next += i;
			printf("\\");
			print_next++; 
		}
		
	} else {
		print_level(node->left,
		            x - node->edge_length - 1,
		            level - node->edge_length - 1);
		print_level(node->right,
		            x + node->edge_length + 1,
		            level - node->edge_length - 1);
	}
}

// This function fills in the edge_length and
// height fields of the specified tree
static void compute_edge_lengths(asciinode *node)
{
	int h, hmin, i, delta;
	if (node == NULL) return;
	compute_edge_lengths(node->left);
	compute_edge_lengths(node->right);
	
	// First fill in the edge_length of node
	if (node->right == NULL && node->left == NULL) {
		node->edge_length = 0;
	
	} else {
		if (node->left == NULL) {
			hmin = 0;
		} else {
			for (i = 0; i < node->left->height && i < MAX_HEIGHT; i++) {
				rprofile[i] = -INFINITY;
			}
			compute_rprofile(node->left, 0, 0);
			hmin = node->left->height;
		}
		
		if (node->right == NULL) {
			hmin = 0;
		} else {
			for (i = 0; i < node->right->height && i < MAX_HEIGHT; i++) {
				lprofile[i] = INFINITY;
			}
			compute_lprofile(node->right, 0, 0);
			hmin = MIN(node->right->height, hmin);
		}
		
		delta = 4;
		for (i = 0; i < hmin; i++) {
			delta = max(delta, gap + 1 + rprofile[i] - lprofile[i]);
		}
		
		// If the node has two children of height 1, then we allow the
		// two leaves to be within 1, instead of 2
		if (delta > 4 &&
			((node->left != NULL && node->left->height == 1) ||
			(node->right != NULL && node->right->height == 1))) {
			delta--;
		}
		node->edge_length = ((delta + 1)/2) - 1;
	}
	
	// Now fill in the height of the node
	h = 1;

	if (node->left != NULL) {
		h = MAX(node->left->height + node->edge_length + 1, h);
	}
	if (node->right != NULL) {
		h = MAX(node->right->height + node->edge_length + 1, h);
	}
	
	node->height = h;
}

static asciinode *build_ascii_tree_recursive(BSTree t)
{
	asciinode *node;
	
	if (t == NULL) return NULL;
	
	node = malloc(sizeof(asciinode));
	node->left = build_ascii_tree_recursive(t->left);
	node->right = build_ascii_tree_recursive(t->right);
	
	if (node->left != NULL) node->left->parent_dir = -1;
	if (node->right != NULL) node->right->parent_dir = 1;
	
	sprintf(node->label, "%d", t->value);
	
	node->lablen = (int)strlen(node->label);
	return node;
}

// Copy the tree into the ascii node structre
static asciinode *build_ascii_tree(BSTree t)
{
	asciinode *node;
	if (t == NULL) return NULL;
	node = build_ascii_tree_recursive(t);
	node->parent_dir = 0;
	return node;
}

// Free all the nodes of the given tree
static void free_ascii_tree(asciinode *node)
{
	if (node == NULL) return;
	free_ascii_tree(node->left);
	free_ascii_tree(node->right);
	free(node);
}

// It assumes that the center of the label of the root of this tree
// is located at a position (x, y). It assumes that the edge_length
// fields have been computed for this tree.
static void compute_lprofile(asciinode *node, int x, int y)
{
	int i, isleft;
	if (node == NULL) return;
	isleft = (node->parent_dir == -1);
	lprofile[y] = MIN(lprofile[y], x - ((node->lablen - isleft)/2));
	if (node->left != NULL) {
		for (i = 1; i <= node->edge_length && y + i < MAX_HEIGHT; i++) {
			lprofile[y + i] = MIN(lprofile[y + i], x - i);
		}
	}
	compute_lprofile(node->left, x - node->edge_length - 1, y + node->edge_length + 1);
	compute_lprofile(node->right, x + node->edge_length + 1, y + node->edge_length + 1);
}

static void compute_rprofile(asciinode *node, int x, int y)
{
	int i, notleft;
	if (node == NULL) return;
	notleft = (node->parent_dir != -1);
	rprofile[y] = MAX(rprofile[y], x + ((node->lablen - notleft)/2));
	if (node->right != NULL) {
		for (i = 1; i <= node->edge_length && y + i < MAX_HEIGHT; i++) {
			rprofile[y + i] = MAX(rprofile[y + i], x + i);
		}
	}
	compute_rprofile(node->left, x - node->edge_length - 1, y + node->edge_length + 1);
	compute_rprofile(node->right, x + node->edge_length + 1, y + node->edge_length + 1);
}


////////////////////////////////////////////////////////////////////////
// Insertion Sort

static int *insertionSortCopy(int *array, int arraySize) {
	int *copy = malloc(arraySize * sizeof(int));
	if (copy == NULL) {
		fprintf(stderr, "Insufficient memory!\n");
		exit(EXIT_FAILURE);
	}
	
	for (int i = 0; i < arraySize; i++) {
		copy[i] = array[i];
	}
	insertionSort(copy, arraySize);
	return copy;
}

static void insertionSort(int *array, int arraySize) {
	for (int i = 1; i < arraySize; i++) {
		int temp = array[i];
		while (i > 0 && array[i - 1] > temp) {
			array[i] = array[i - 1];
			i--;
		}
		array[i] = temp;
	}	
}

