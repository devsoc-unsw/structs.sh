export const insertCodeSnippet = `struct node *insert(index, struct node *head) {
    struct node *new_node = create_new_node(input);
    if (index == 0) {
        new_node->next = head;
    }

    if (index == 0 || head == NULL) {
        head = new_node;
        return head;
    } 

    int curr_pos = 0;
    struct node *curr = head;
    while (curr_pos < index - 1 && curr->next != NULL) {
        curr_pos++;
        curr = curr->next;
    }

    new_node->next = curr->next;
    curr->next = new_node;

    return head;
}`;

export const appendCodeSnippet = `struct node *append(int data, struct node *head) {
    struct node *new_tail = create_new_node(data);
    if (head == NULL) {
        head = new_tail;
        return head;
    }

    struct node *curr = head;
    while (curr->next != NULL) {
        curr = curr->next;
    }

    curr->next = new_tail

    return head;
}`;

export const deleteCodeSnippet = `struct node *delete(int index, struct node *head) {
    struct node *prev = NULL;
    struct node *curr = head;
    int curr_index = 0;
    while (curr_index < index) {
        prev = curr;
        curr = curr->next;
        curr_index++;
    }

    if (prev == NULL) {
        head = head->next;
    } else {
        prev->next = curr->next;
    }
    free(curr);

    return head;
}`;

export const prependCodeSnippet = `struct node *prepend(int data, struct node *head)
    struct node *new_head = create_new_node(input);
    new_head->next = head;
    head = new_head;
    return head;
}`;

export const searchCodeSnippet = `bool search(int data, struct node *head) {
    struct node *curr = list->head;
    while (curr != NULL && curr->data != data) {
        curr = curr->next;
    }
    return curr != NULL;
}`;
