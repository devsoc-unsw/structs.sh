
// Example struct definition for a 'node' in a linked list:
struct node {
    int data;
    char *string;
    struct node *prev; 
    struct node *next;    // Each node holds the address of the next node
};



// Example struct definition for a tree
struct treeNode {
    int data;
    struct node *left;    // Each node holds the address of its 'left child'
    struct node *right;   // and its 'right child' 
};



// Example struct definition for a graph
struct graph {
    int **adjacencyMatrix;   // This is just a matrix of integers. 
}                            // No need to know about this until about week 6 
