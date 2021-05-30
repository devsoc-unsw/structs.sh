
// Typical node definition:
struct node {
    int value;
    struct node *next;
};
typedef struct node Node;

// These two functions below do EXACTLY the same thing. 
// They both print the values in a linked list.

// Non-recursive version
void printList(Node *head) {
    Node *curr = head;
    while (curr != NULL) {
        printf("%d\n", curr -> value);
        curr = curr -> next;
    }
}

// Recursive version
void printList(Node *head) {
    if (head == NULL) {                // This is the 'base condition' 
        return;
    } else {
        printf("%d\n", head -> value);
        printList(head -> next);  
    }
}

/*
    1 → 3 → 5 → NULL
    |
    |
    head
*/

