export const insertCodeSnippet = `struct node *insert(struct node *node, int value) {
    if (node == null)
        return create_new_node(value);
    if (value < node->value)
        node->left = insert(node->left, value);
    else if (value > node->value)
        node->right = insert(node->right, value);
    else
        return node;

    node->height = height(node);
    int balance = height(node->left) - height(node->right);
    if (balance > 1) {
        if (value > node->left->value) 
            node->left = rotate_left(node->left);
        return rotate_right(node);
    } else if (balance < -1) {
        if (value < node->right->value) 
            node->right = rotate_right(node->right);
        return rotate_left(node);
    } 
    return node;
}`;
