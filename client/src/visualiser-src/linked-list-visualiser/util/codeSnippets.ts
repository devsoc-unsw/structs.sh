export const insertCodeSnippet = `void insert(int data, int index, struct list *list) {
    struct node *new_node = create_new_node(data);
    if (index == 0) {
        new_node->next = list->head;
    }

    if (index == 0 || list->head == NULL) {
        list->head = new_node;
        return;
    } 

    int curr_pos = 0;
    struct node *curr = list->head;
    while (curr_pos < index - 1 && curr->next != NULL) {
        curr_pos++;
        curr = curr->next;
    }

    new_node->next = curr->next;
    curr->next = new_node;
}`;

export const appendCodeSnippet = `void append(int data, struct list *list) {
    struct node *new_tail = create_new_node(data);
    if (list->head == NULL) {
        list->head = new_tail;
        return;
    }

    struct node *curr = list->head;
    while (curr->next != NULL) {
        curr = curr->next;
    }

    curr->next = new_tail
}`;

export const deleteCodeSnippet = `void delete(int index, struct list *list) {
    struct node *prev = NULL;
    struct node *curr = list->head;
    int curr_index = 0;
    while (curr_index < index) {
        prev = curr;
        curr = curr->next;
        curr_index++;
    }

    if (prev == NULL) {
        list->head = list->head->next;
    } else {
        prev->next = curr->next;
    }
    free(curr);
}`;

export const prependCodeSnippet = `void prepend(int data, struct list *list)
    struct node *new_head = create_new_node(input);
    new_head->next = list->head;
    list->head = new_head;
}`;

export const searchCodeSnippet = `int search(int data, struct list *list) {
    struct node *curr = list->head;
    while (curr != NULL && curr->data != data) {
        curr = curr->next;
    }
    return curr != NULL;
}`;
