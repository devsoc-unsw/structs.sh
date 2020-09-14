
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
    if (head == NULL) {
        return;
    } else {
        printf("%d\n", head -> val);
        printList(head -> next);
    }
}


