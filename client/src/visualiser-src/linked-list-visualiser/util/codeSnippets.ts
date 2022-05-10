export const insertCodeSnippet = `struct node *new_node = create_node(input);
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
curr->next = new_node;`;

export const appendCodeSnippet = `struct node *new_tail = create_node(input);
if (list->head == NULL) {
    list->head = new_tail;
}

struct node *curr = list->head;
while (curr->next != NULL) {
    curr = curr->next;
}

curr->next = new_tail`;

export const deleteCodeSnippet = `struct node *prev = NULL;
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
free(curr);`;

export const prependCodeSnippet = `struct node *new_head = create_node(input);
new_head->next = list->head;
list->head = new_head;`;

export const searchCodeSnippet = `struct node *curr = list->head;
while (curr != NULL && curr->data != input) {
    curr = curr->next;
}
return curr != NULL;`;
