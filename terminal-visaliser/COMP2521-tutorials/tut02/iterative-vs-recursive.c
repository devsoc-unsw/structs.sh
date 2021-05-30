
// Typical node definition:
struct node {
    int val;
    struct node *next;
};
typedef struct node Node;

// These two functions do EXACTLY the same thing. 
// They both print the values in a linked list

// Iterative version
void printList(Node *head) {
    Node *curr = head;
    while (curr != NULL) {
        printf("%d\n", curr -> val);
        curr = curr -> next;
    }
}

// Recursive version
void printList(Node *head) {
    if (head == NULL) {   // Base condition here (also called the exit condition)
        return;
    }
    printf("%d\n", head -> val);
    printList(head -> next);
}


