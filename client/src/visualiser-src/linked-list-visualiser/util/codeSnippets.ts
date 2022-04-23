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
curr->next = new_node;
`;
