// Adapted from: http://web.archive.org/web/20090617110918/http://www.openasthra.com/c-tidbits/printing-binary-trees-in-ascii/
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
///////////////////////

struct treeNode {
    int value;
    struct treeNode *left;
    struct treeNode *right;
};
typedef struct treeNode TreeNode;

TreeNode *newNode(int value) {
    TreeNode *newTreeNode = malloc(sizeof(TreeNode));
    newTreeNode -> value = value;
    newTreeNode -> left = NULL;
    newTreeNode -> right = NULL;
    return newTreeNode;
}

/**
 * Given a tree and a value, creates a new asciiNode carrying the value
 * and inserts it into the appropriate position in the tree. Returns
 * the tree with the new asciiNode inserted
 * Doesn't handle duplicate values!
 */
TreeNode *insert(TreeNode *root, int value) {
    if (root == NULL) {
        // Insertion point reached if the tree is empty
        TreeNode *newTreeNode = newNode(value);
        return newTreeNode;
    }

    if (value < root -> value) {
        // Insertion point exists somewhere in the left subtree
        root -> left = insert(root -> left, value); 
    } else {
        // Insertion point exists somewhere in the right subtree
        root -> right = insert(root -> right, value);
    }
}

TreeNode *buildTree(int *values, int size) {
    TreeNode *root = NULL;
    for (int i = 0; i < size; i++) {
        root = insert(root, values[i]);
    }
    return root;
}

#define MAX_HEIGHT 1000
#define INFINITY (1<<20)

// ===== Globals =====
int lprofile[MAX_HEIGHT];
int rprofile[MAX_HEIGHT];
// Adjust gap between left and right nodes
int gap = 3;  
/**
 * Printing the next asciiNode in the same level. 
 * This is the x coordinate of the next char printed
 */
int print_next;  
// ===================    

struct asciiNode {
    AsciiNode *left;
    AsciiNode *right;
    int        edge_length;    // Length of the edge from this asciiNode to its children
    int        height;      
    int        lablen;
    int        parent_dir;     // -1=I am left, 0=I am root, 1=right   
    char       label[11];      // Max supported unit32 in dec, 10 digits max
};
typedef struct asciiNode AsciiNode;

// ===================

int MIN (int X, int Y) {
    return ((X) < (Y)) ? (X) : (Y);
}

int MAX (int X, int Y) {
    return ((X) > (Y)) ? (X) : (Y);
}

/**
 * Recursively build the ascii tree. See wrapper function
 * buildAsciiTree
 */
AsciiNode *buildAsciiTreeRecursive(TreeNode *t)  {
    AsciiNode *asciiNode;
    if (t == NULL) return NULL;
    asciiNode = malloc(sizeof(AsciiNode));
    asciiNode -> left = buildAsciiTreeRecursive(t -> left);
    asciiNode -> right = buildAsciiTreeRecursive(t -> right);
    if (asciiNode -> left != NULL) {
        asciiNode -> left -> parent_dir = -1;
    }
    if (asciiNode -> right != NULL) {
        asciiNode -> right -> parent_dir = 1;
    }
    sprintf(asciiNode -> label, "%d", t -> value);
    asciiNode -> lablen = strlen(asciiNode -> label);
    return asciiNode;
}

/**
 * Copy the tree into the ascii asciiNode structure
 */
AsciiNode *buildAsciiTree(TreeNode * t) {
    AsciiNode *asciiNode;
    if (t == NULL) return NULL;
    asciiNode = buildAsciiTreeRecursive(t);
    asciiNode -> parent_dir = 0;
    return asciiNode;
}

/**
 * Free all the nodes of the given tree
 */
void freeAsciiTree(AsciiNode *asciiNode) {
    if (asciiNode == NULL) return;
    freeAsciiTree(asciiNode -> left);
    freeAsciiTree(asciiNode -> right);
    free(asciiNode);
}

// The following function fills in the lprofile array for the given tree.
// It assumes that the center of the label of the root of this tree
// is located at a position (x,y).  It assumes that the edge_length
// fields have been computed for this tree.
void computeLProfile(AsciiNode *asciiNode, int x, int y) {
    int i, isleft;
    if (asciiNode == NULL) return;
    isleft = (asciiNode -> parent_dir == -1);
    lprofile[y] = MIN(lprofile[y], x-((asciiNode -> lablen-isleft)/2));
    if (asciiNode -> left != NULL) {
        for (i=1; i <= asciiNode -> edge_length && y+i < MAX_HEIGHT; i++) {
            lprofile[y+i] = MIN(lprofile[y+i], x-i);
        }
    }
    computeLProfile(asciiNode -> left, x-asciiNode -> edge_length-1, y+asciiNode -> edge_length+1);
    computeLProfile(asciiNode -> right, x+asciiNode -> edge_length+1, y+asciiNode -> edge_length+1);
}

void compute_rprofile(AsciiNode *asciiNode, int x, int y)  {
    int i, notleft;
    if (asciiNode == NULL) return;
    notleft = (asciiNode -> parent_dir != -1);
    rprofile[y] = MAX(rprofile[y], x+((asciiNode -> lablen-notleft)/2));
    if (asciiNode -> right != NULL) {
        for (i=1; i <= asciiNode -> edge_length && y+i < MAX_HEIGHT; i++) {
            rprofile[y+i] = MAX(rprofile[y+i], x+i);
        }
    }
    compute_rprofile(asciiNode -> left, x-asciiNode -> edge_length-1, y+asciiNode -> edge_length+1);
    compute_rprofile(asciiNode -> right, x+asciiNode -> edge_length+1, y+asciiNode -> edge_length+1);
}

//This function fills in the edge_length and 
//height fields of the specified tree
void computeEdgeLengths(AsciiNode *asciiNode)  {
    int h, hmin, i, delta;
    if (asciiNode == NULL) return;
    computeEdgeLengths(asciiNode -> left);
    computeEdgeLengths(asciiNode -> right);

    /* first fill in the edge_length of asciiNode */
    if (asciiNode -> right == NULL && asciiNode -> left == NULL) {
        asciiNode -> edge_length = 0;
    } 
    else {
        if (asciiNode -> left != NULL) 
        {
            for (i=0; i<asciiNode -> left -> height && i < MAX_HEIGHT; i++) 
        {
                rprofile[i] = -INFINITY;
            }
            compute_rprofile(asciiNode -> left, 0, 0);
            hmin = asciiNode -> left -> height;
        } 
        else 
        {
            hmin = 0;
        }
        if (asciiNode -> right != NULL) 
        {
            for (i=0; i<asciiNode -> right -> height && i < MAX_HEIGHT; i++) 
        {
                lprofile[i] = INFINITY;
            }
            computeLProfile(asciiNode -> right, 0, 0);
            hmin = MIN(asciiNode -> right -> height, hmin);
        } 
        else 
        {
            hmin = 0;
        }
        delta = 4;
        for (i=0; i<hmin; i++) 
        {
            delta = MAX(delta, gap + 1 + rprofile[i] - lprofile[i]);
        }
        
        //If the asciiNode has two children of height 1, then we allow the
        //two leaves to be within 1, instead of 2 
        if (((asciiNode -> left != NULL && asciiNode -> left -> height == 1) ||
            (asciiNode -> right != NULL && asciiNode -> right -> height == 1))&&delta>4) 
        {
        delta--;
        }
            
        asciiNode -> edge_length = ((delta+1)/2) - 1;
    }

    //now fill in the height of asciiNode
    h = 1;
    if (asciiNode -> left != NULL) 
    {
        h = MAX(asciiNode -> left -> height + asciiNode -> edge_length + 1, h);
    }
    if (asciiNode -> right != NULL) 
    {
        h = MAX(asciiNode -> right -> height + asciiNode -> edge_length + 1, h);
    }
    asciiNode -> height = h;
}

/**
 * Prints the given level of a given tree. Assumes that the asciiNode
 * has the given x coordinate.
 */
void printLevel(AsciiNode *asciiNode, int x, int level)  {
    int i, isleft;
    if (asciiNode == NULL) return;
    isleft = (asciiNode -> parent_dir == -1);
    if (level == 0) {
        for (i=0; i<(x-print_next-((asciiNode -> lablen-isleft)/2)); i++) {
            printf(" ");
        }
        print_next += i;
        printf("%s", asciiNode -> label);
        print_next += asciiNode -> lablen;
    } 
    else if (asciiNode -> edge_length >= level) {
        if (asciiNode -> left != NULL) 
        {
            for (i=0; i<(x-print_next-(level)); i++) 
        {
                printf(" ");
            }
            print_next += i;
            printf("/");
            print_next++;
        }
        if (asciiNode -> right != NULL) 
        {
            for (i=0; i<(x-print_next+(level)); i++) 
        {
                printf(" ");
            }
            print_next += i;
            printf("\\");
            print_next++;
        }
    } 
    else {
        printLevel(asciiNode -> left, 
                    x-asciiNode -> edge_length-1, 
                    level-asciiNode -> edge_length-1);
        printLevel(asciiNode -> right, 
                    x+asciiNode -> edge_length+1, 
                    level-asciiNode -> edge_length-1);
    }
}

/** 
 * Given the tree, constructs an ascii tree and prints it
 */
void printTree(TreeNode *t) {
    AsciiNode *proot;
    int xmin, i;
    if (t == NULL) return;
    proot = buildAsciiTree(t);
    computeEdgeLengths(proot);
    for (i=0; i<proot -> height && i < MAX_HEIGHT; i++) {
        lprofile[i] = INFINITY;
    }
    computeLProfile(proot, 0, 0);
    xmin = 0;
    for (i = 0; i < proot -> height && i < MAX_HEIGHT; i++) {
        xmin = MIN(xmin, lprofile[i]);
    }
    for (i = 0; i < proot -> height; i++) {
        print_next = 0;
        printLevel(proot, -xmin, i);
        printf("\n");
    }
    if (proot -> height >= MAX_HEIGHT) {
        printf("(This tree is taller than %d, and may be drawn incorrectly.)\n", MAX_HEIGHT);
    }
    freeAsciiTree(proot); 
}

